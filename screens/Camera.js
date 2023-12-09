import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/native";

// AI RELATED
import * as tf from "@tensorflow/tfjs";
import {
  fetch,
  decodeJpeg,
  bundleResourceIO,
} from "@tensorflow/tfjs-react-native";
import classes from "../config/classes";
import apple from "../apple3.jpg";

const App = () => {
  var Buffer = require("buffer/").Buffer;
  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState([]);
  const [cropped, setCropped] = useState("");
  const image = useRef(null);
  let dataLength;
  let x = [],
    y = [],
    w = [],
    h = [];
  let cropUri = [];
  let pred = [];
  let imageData = [];

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  let photoURI;

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const load = async () => {
    try {
      await tf.ready();
      const modelJson = await require("../assets/model/model.json");
      const modelWeight = await require("../assets/model/weights.bin");
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeight)
      );
      const preds = [];
      console.log("MODEL LOADED");
      console.log(photoURI);
      console.log(x, y, w, h);

      for (let i = 0; i < dataLength; i++) {
        const manipResult = await manipulateAsync(
          photoURI,
          [
            {
              crop: {
                originX: x[i],
                originY: y[i],
                width: w[i],
                height: h[i],
              },
            },
          ],
          { base64: true }
        );
        console.log("finish cropping");

        cropUri[i] = manipResult.base64;

        imageData[i] = Buffer.from(cropUri[i], "base64");

        let imageTensor = decodeJpeg(imageData[i]);
        imageTensor = imageTensor
          .resizeBilinear([224, 224])
          .reshape([1, 224, 224, 3]);
        imageTensor = imageTensor.dataSync().map((j) => j / 255);
        newTensor = tf.tensor(imageTensor);
        newTensor = newTensor.reshape([1, 224, 224, 3]);
        console.log(newTensor);
        let prediction = await model.predict(newTensor).data();
        let prob = prediction.reduce((a, b) => Math.max(a, b), -Infinity);
        pred[i] = classes[prediction.indexOf(prob)];
        console.log(pred[i]);
        preds.push(pred[i]);
      }
      console.log(preds);
      navigation.navigate("Search", { preds });
    } catch (err) {
      console.log(err);
    }
  };

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    console.log(newPhoto.uri);

    const example = Image.resolveAssetSource(apple).uri;
    const manipResult = await manipulateAsync(
      example,
      [
        {
          resize: { width: 500, height: 500 },
        },
      ],
      { base64: true }
    );
    photoURI = manipResult.uri;

    fetch("https://flask-server-by00.onrender.com/photo", {
      method: "POST",
      body: manipResult.base64,
      mode: "cors",
    }).then((data) => {
      console.log(data._bodyText);
    });

    fetch("https://flask-server-by00.onrender.com/process", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("mamamia!");
        }
        return res.json();
      })
      .then((data) => {
        dataLength = Object.keys(data).length;
        console.log("Data Length:", dataLength);
        for (let i = 0; i < dataLength; i++) {
          [i, x[i], y[i], w[i], h[i]] = data[i];
        }
      })
      .catch((error) => {
        console.log(error);
      });

    load();
  };

  if (photoURI) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Image
          style={{ alignSelf: "stretch", flex: 1 }}
          source={{ uri: photoURI }}
        />
        <Button title="Confirm" onPress={() => setPhoto(photo)}></Button>
      </SafeAreaView>
    );
  }

  return (
    <Camera
      ref={cameraRef}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ backgroundColor: "#fff", alignSelf: "flex-end" }}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
    </Camera>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    height: hp(100),
  },
  header: {
    height: hp(15),
    backgroundColor: "red",
  },
  main: {
    height: hp(70),
    display: "flex",
    flexDirection: "row",
  },
  section1: {
    width: wp(50),
    backgroundColor: "yellow",
  },
  section2: {
    width: wp(50),
    backgroundColor: "orange",
  },
  footer: {
    height: hp(15),
    backgroundColor: "lightgreen",
  },
  content: {
    fontSize: hp(2),
  },
});
