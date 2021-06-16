<template>
  <div class="example">
    <cropper ref="cropper" class="example-cropper" :src="image" />
    <div class="button-wrapper">
      <span class="button" @click="$refs.file.click()">
        <input
          type="file"
          ref="file"
          @change="uploadImage($event)"
          accept="image/*"
        />
        Upload image
      </span>
      <span class="button" @click="cropImage">Crop image</span>
    </div>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "App",
  data() {
    return {
      image:
        "https://images.pexels.com/photos/4218687/pexels-photo-4218687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    };
  },
  methods: {
    cropImage() {
      const result = this.$refs.cropper.getResult();
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${result.canvas.toDataURL(
        "image/jpeg"
      )}"></img>`;
    },
    uploadImage(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.image = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
  },
  components: {
    Cropper,
  },
};
</script>
