<template>
  <div class="form" refs="formA">
    <div class="form-box">
      <cropper
        ref="cropper"
        class="example-cropper"
        :src="image"
        :stencil-props="{
          handlers: {},
          movable: false,
          scalable: false,
        }"
        :stencil-size="{
          width: 280,
          height: 280,
        }"
        image-restriction="stencil"
      />
      <div class="downForm">
        <span class="file-input" @click="$refs.file.click()">
          <input
            type="file"
            ref="file"
            @change="uploadImage($event)"
            accept="image/*"
          />
          Загрузить
        </span>
        <span class="buttonUp" @click="cropImage">Обновить</span>
      </div>
      <!-- <div class="image-box">
                    <div id="upload-image"></div>
                </div>
                <div class="downForm">
                    <div class="file-input">
                        <input type="file" id="images" class="file">
                        <label id="tr" for="images">Загрузить</label>
                      </div>
                    <button class="buttonUp">Обновить</button>
                </div> -->
    </div>
  </div>
  <div class="overlay" @click="$emit('close')"></div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
export default {
  data() {
    return {
      image: this.originalImg,
    };
  },
  inject: ["originalImg"],
  // props: {
  //   img: String,
  // },
  watch: {
    img: {
      deep: true,
    },
  },
  // mounted(){
  //   let elem = this.$refs.file
  //   elem.click()
  // },
  methods: {
    cropImage() {
      const result = this.$refs.cropper.getResult();
      // const newAvatar = this.$refs.avatar;
      // newAvatar.src = result.canvas.toDataURL("image/jpeg");
      this.$emit("newImg", result.canvas.toDataURL("image/jpeg"));
      this.$emit("close");
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
          this.originalImg = e.target.result;
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

<style scoped>
.form {
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin-left: -325px;
  margin-top: -300px;
  left: 50%;
  top: 50%;
  height: 600px;
  width: 650px;
  border-radius: 12px;
  background-color: #fff;
  border: 0.8px solid #d4d4d4;
}

.form-box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.downForm {
  width: 75%;
  height: 15%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
</style>
