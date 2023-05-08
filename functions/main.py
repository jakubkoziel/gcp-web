# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from io import BytesIO
from PIL import Image
from pathlib import Path
import torch

from google.cloud import storage
# from firebase_functions import https_fn
# from firebase_admin import initialize_app
import functions_framework

from DeOldify.deoldify.filters import MasterFilter, ColorizerFilter
from DeOldify.deoldify.generators import gen_inference_deep
from DeOldify.deoldify import device
from DeOldify.deoldify.device_id import DeviceId


@functions_framework.cloud_event
def transform_old_image(cloud_event):
    data = cloud_event.data

    event_id = cloud_event["id"]
    event_type = cloud_event["type"]

    bucket = data["bucket"]
    name = data["name"]
    metageneration = data["metageneration"]
    timeCreated = data["timeCreated"]
    updated = data["updated"]

    print(f"Event ID: {event_id}")
    print(f"Event type: {event_type}")
    print(f"Bucket: {bucket}")
    print(f"File: {name}")
    print(f"Metageneration: {metageneration}")
    print(f"Created: {timeCreated}")
    print(f"Updated: {updated}")

    if name.startswith('deoldified_'):
        return None
    else:
        device.set(device=DeviceId.CPU)
        torch.backends.cudnn.benchmark = True
        image = get_photo(bucket, name)
        print(f"photo downloaded")
        transformed = colorize_image(image)
        upload_to_bucket(bucket, 'deoldified_' + name, transformed)
        print('transformed image uploaded to bucket')


def upload_to_bucket(bucket_name, blob_name, file):
    """ Upload data to a bucket"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    img_byte_arr = BytesIO()
    file.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()

    blob.upload_from_string(img_byte_arr, content_type='image/jpeg')


def get_photo(bucket_name, blob_name) -> Image.Image:
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob_bytes = blob.download_as_bytes()
    img = Image.open(BytesIO(blob_bytes))
    return img


def colorize_image(orig_image: Image.Image):
    # unwrapped functions from deoldify module and demo notebook
    weights_name: str = 'ColorizeArtistic_gen'
    render_factor: int = 35  # value proposed by authors, higher means more compute complexity
    root_folder = Path('./DeOldify/')
    learn = gen_inference_deep(root_folder=root_folder, weights_name=weights_name)
    filtr = MasterFilter([ColorizerFilter(learn=learn)], render_factor=render_factor)
    filtered_image = filtr.filter(
        orig_image, orig_image, render_factor=render_factor, post_process=True
    )
    return filtered_image
