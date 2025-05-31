import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, set } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Cloudinary } from '@cloudinary/url-gen';
import { upload, UploadApiOptions } from 'cloudinary-react-native';


export default function CreateBlog() {
  //   const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [cloudImage, setCloudImage] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
        const pickedImages = result.assets[0].uri;
      setImage(result.assets[0].uri);
      const cid = new Cloudinary({
        cloud: {
            cloudName: 'dpco2f0zr',
        },
        url: {
            secure: true,
        },
      })
      const options:UploadApiOptions = {
        upload_preset: "blogApp",
        unsigned:true,
      }
      await upload(cid, {
        file:pickedImages,
        options,
        callback: (error:any, result:any) => {
            console.log("Upload result:", result);
            setLoading(false);
            if(error){
                Alert.alert("Upload failed", error.message || "Please try again");
            }else{
                setCloudImage(result.secure_url);
                Alert.alert("Image uploaded successfully", "You can now submit your blog post.");
            }
        }
      })
    }
  };

  const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
    category: z.string().min(1, { message: "Category is required" }),
  });

  type formSchemaType = z.infer<typeof schema>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<formSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (blogData: formSchemaType) => {
    console.log("Blog Data:", blogData);
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={styles.centeredContainer}>
        <View style={styles.formBox}>
          <Text style={styles.header}>Create Blog</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 4,
              color: "#334155",
            }}
          >
            Title
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <View>
            {errors.title && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 8 }}>
                {errors.title.message}
              </Text>
            )}
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 4,
              color: "#334155",
            }}
          >
            Category
          </Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Catgory"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <View>
            {errors.category && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 8 }}>
                {errors.category.message}
              </Text>
            )}
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 4,
              color: "#334155",
            }}
          >
            Content
          </Text>
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Content"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={6}
                onBlur={onBlur}
              />
            )}
          />
          <View>
            {errors.content && (
              <Text style={{ color: "red", fontSize: 12, marginBottom: 8 }}>
                {errors.content.message}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>
              {image ? "Change Image" : "Upload Image"}
            </Text>
          </TouchableOpacity>
          {image && (
            <Text
              style={{
                color: "green",
                marginTop: 8,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Image selected!
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
