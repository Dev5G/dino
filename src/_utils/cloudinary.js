import Axios from "axios";
import { blobToBase64 } from "./converters";

//import { Cloudinary } from 'cloudinary-core';
const uploadURL = 'https://api.cloudinary.com/v1_1/sgt/image/upload'
const signatureURL = ''

export const uploadToCloudSigned = (files, options = {}, callback = function (error, result) { console.log(result, error); }) => {
    //TODO:get "api_key" from environment and append to form
    Axios.get(signatureURL)
        .then(r => {
            const { signature, timestamp, folder } = r.data
            for (let i = 0; i < files.length; i++) {
                let formData = new FormData()
                blobToBase64(files[i])
                    .then(image => {
                        formData.append("file", image);
                        formData.append("api_key", "123456789012345");
                        formData.append("folder", folder);
                        formData.append("timestamp", timestamp);
                        formData.append("signature", signature);
                        // Append any other optional parameters (remember these must also be included in your signature generation code)
                        Axios(uploadURL, formData)
                    })
                    .catch(e => {
                        console.log(e)
                        callback(true, 'file conversion failed!')
                    })
            }
        })
        .catch(e => {
            console.log(e)
        })
}
//export default uploadToCloudSigned