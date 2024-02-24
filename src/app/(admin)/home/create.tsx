import { Alert, Dimensions, Image, Platform, StyleSheet, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/api/products';
import * as ImagePicker from "expo-image-picker";
import { randomUUID } from "expo-crypto"; 
import { decode } from "base64-arraybuffer";  
import {  categories, brands } from "../../../utils/data"; 
import * as FileSystem from "expo-file-system";
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { AppContainer } from '@/components/AppContainer';
import { Text } from '@/components/Theme';
import Button from '@/components/Button';
import { Space } from '@/components/Space';
import tw from "twrnc";
import RNPickerSelect from "react-native-picker-select";
import { getAvailableSubtypes } from '@/utils/generateSubtypes';
import { generateFieldsForCategory } from '@/utils/generateFieldsForCategory';
import DynamicForm from '@/components/FormDyamic';
import { supabaseClient } from '@/utilities/supabaseClient';
const { width } = Dimensions.get("window");



export default function CreateProduct () {
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [uploadedImages, setUploadedImages] = useState<string[]>([]);
 const [selectedImages, setSelectedImages] = useState<string[]>([]);
 const [image, setImage] = useState("");
 const [category, setCategory] = useState("");
 const [avg_rating, setAvgRating] = useState("0");
 const [ratings, setRatings] = useState("0");
 const [brand, setBrand] = useState("");
 const [count, setCount] = useState("0");
 const [price, setPrice] = useState("0");
 const [sub_category, setSubCategory] = useState<string | null>(null);
 const [old_price, setOldPrice] = useState("0");
 const [product_details, setProductDetails] = useState({});
 
  
 const [isLoading, setIsLoading] = useState(false);
 const [errors, setErrors] = useState<string | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [successMessage, setSuccessMessage] = useState<string | null>(null);
 const [token, setToken] = useState<any>(null);

  const { getToken } = useAuth();
  
  // useEffect(() => {
  //   const GetToken = async () => {
  //     const token = await getToken();
  //     setToken(token);
  //   };
  //   GetToken();
  // }, [token]);
  
  const { id: idString } = useLocalSearchParams();
  // const id = parseFloat(typeof idString === "string" ? idString : idString?.[0]);
  
  const isUpdating = !!idString;


  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(idString as string);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setTitle(updatingProduct.title || ""); // Ensure title is not null
      setDescription(updatingProduct.description || ""); // Ensure description is not null
      setUploadedImages(updatingProduct.images || []); // Ensure images is not null
      setImage(updatingProduct.image || ""); // Ensure image is not null
      setCategory(updatingProduct.category || ""); // Ensure category is not null
      setAvgRating(updatingProduct.avg_rating?.toString() || "0"); // Ensure avg_rating is not null
      setRatings(updatingProduct.ratings?.toString() || "0"); // Ensure ratings is not null
      setBrand(updatingProduct.brand || ""); // Ensure brand is not null
      setCount(updatingProduct.count?.toString() || "0"); // Ensure count is not null
      setPrice(updatingProduct.price?.toString() || "0"); // Ensure price is not null
      setSubCategory(updatingProduct.sub_category || ""); // Ensure sub_category is not null
      setOldPrice(updatingProduct.old_price?.toString() || "0"); // Ensure old_price is not null
      setProductDetails(updatingProduct.product_details || {}); // Ensure product_details is not null
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setUploadedImages([]);
    setImage("");
    setCategory("");
    setAvgRating("0");
    setRatings("0");
    setBrand("");
    setCount("0");
    setPrice("0");
    setSubCategory(null);
    setOldPrice("0");
    setProductDetails({});
  };

   const validateInput = () => {
     setErrors("");
     if (!title) {
       setErrors("Title is required");
       return false;
     }
     if (!description) {
       setErrors("Description is required");
       return false;
     }
     // if (!image) {
     //   setErrors("Image is required");
     //   return false;
     // }
     if (!category) {
       setErrors("Category is required");
       return false;
     }
     if (!avg_rating) {
       setErrors("Avg Rating is required");
       return false;
     }
     if (!ratings) {
       setErrors("Ratings is required");
       return false;
     }
     if (!brand) {
       setErrors("Brand is required");
       return false;
     }
     if (!count) {
       setErrors("Count is required");
       return false;
     }
     if (!price) {
       setErrors("Price is required");
       return false;
     }
     if (!sub_category && !updatingProduct) {
       setErrors("Sub Category is required");
       return false;
     }
     if (!old_price) {
       setErrors("Old Price is required");
       return false;
     }
     if (!product_details) {
       setErrors("Product Details is required");
       return false;
     }
     return true;
   };

   const onSubmit = () => {
     if (isUpdating) {
       // update
       onUpdate();
     } else {
       // create
       onCreate();
     }
   };
  
  const onCreate = () => {
    if (!validateInput()) {
      return;
    }

    const product = {
      title,
      description,
      images: uploadedImages,
      image: uploadedImages[0],
      brand,
      category,
      avg_rating: parseFloat(avg_rating),
      ratings: parseInt(ratings),
      count: parseInt(count),
      price: parseFloat(price),
      old_price: parseFloat(old_price),
      sub_category,
      product_details,
    };
    insertProduct(product, {
      onSuccess: () => {
        alert("Product created successfully");
        resetFields();
        router.back();
      },
      onError: (error: any) => {
        alert(error.message);
      },
    });
  };

  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }

    updateProduct(
      {
        id: idString as string,
        title,
        description,
        images: uploadedImages,
        image: uploadedImages[0],
        brand,
        category,
        avg_rating: parseFloat(avg_rating),
        ratings: parseInt(ratings),
        count: parseInt(count),
        price: parseFloat(price),
        old_price: parseFloat(old_price),
        sub_category,
        product_details,
      },
      {
        onSuccess: () => {
          alert("Product updated successfully");
          resetFields();
          router.back();
        },
        onError: (error: any) => {
          alert(error.message);
        },
      }
    );
  };


  const onDelete = () => {
    deleteProduct(idString as string, {
      onSuccess: () => {
        alert("Product deleted successfully");
        resetFields();
        router.back();
      },
      onError: (error: any) => {
        alert(error.message);
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubCategory(null);
    setProductDetails({});
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    setProductDetails({});
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
    setProductDetails({});
  };

  const handleProductDetailsChange = (key: string, value: string) => {
    setProductDetails((prev) => ({ ...prev, [key]: value }));
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map(({ uri }) => uri));
    } else {
      alert("You haven't selected any image");
    }
  };

  const uploadImages = async () => {
    setIsLoading(true);
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token);

    const validSelectedImages = selectedImages.filter(
      (uri) => uri && uri.startsWith("file://")
    );

    const uploadPromises = validSelectedImages.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri!, {
        encoding: "base64",
      });

      const filePath = `${randomUUID()}.png`;
      const contentType = "image/png";

      try {
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filePath, decode(base64), { contentType });

        if (data) {
          return data.path;
        } else {
          throw new Error(error.message);
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    });
    const uploadedPaths = await Promise.all(uploadPromises);

    setIsLoading(false);

    const successfulUploads = uploadedPaths.filter(
      (path) => path !== null
    ) as string[];

    if (successfulUploads.length === validSelectedImages.length) {
      setUploadedImages([...uploadedImages, ...successfulUploads]);
      //setSelectedImages([]);
      setSuccessMessage("Images uploaded successfully");
    } else {
      setError("Error uploading one or more images. Please try again. ");
    }
  };

const showIconPlatform =
  Platform.OS === "android" ? (
    <></>
  ) : (
    <MaterialIcons
      style={{ position: "absolute", right: 10, top: 10 }}
      name="keyboard-arrow-down"
      size={25}
      color="black"
    />
  );

  return (
    <AppContainer>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerBackTitleStyle: { fontFamily: "airMedium" },
            headerTitleStyle: { fontFamily: "airMedium" },
            title: "Create Product",
          }}
        />
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          style={styles.input}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          style={styles.input}
        />
        <Text style={styles.label}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Count</Text>
        <TextInput
          value={count}
          onChangeText={setCount}
          placeholder="Count"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Old Price</Text>
        <TextInput
          value={old_price}
          onChangeText={setOldPrice}
          placeholder="Old Price"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Ratings</Text>
        <TextInput
          value={ratings}
          onChangeText={setRatings}
          placeholder="Ratings"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Avg Rating</Text>
        <TextInput
          value={avg_rating}
          onChangeText={setAvgRating}
          placeholder="Avg Rating"
          style={styles.input}
          keyboardType="numeric"
        />
        <Button
          //variant="primary"
          label="Pick Images"
          onPress={pickImages}
          style={{ marginBottom: 10 }}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {selectedImages.map((uri) => (
            <View
              key={uri}
              style={{
                width: 100,
                height: 100,
                margin: 5,
                backgroundColor: "gray",
              }}
            >
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          ))}
        </View>
        <Button
          //variant="primary"
          label="Upload Images"
          onPress={uploadImages}
          style={{ marginBottom: 10 }}
        />
        {isLoading && <Text>Uploading...</Text>}
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        {successMessage && (
          <Text style={{ color: "green" }}>{successMessage}</Text>
        )}
        <Space />
        <View
          style={tw` flex-row  bg-white border-[1.5px] rounded-md h-13 justify-between px-2 border-slate-300 items-center relative`}
        >
          <View>
            <RNPickerSelect
              onValueChange={handleBrandChange}
              style={pickerSelectStyles}
              value={brand}
              placeholder={{ label: "Select a brand", value: null }}
              items={brands.map((brand) => ({
                label: brand,
                value: brand,
              }))}
            />
          </View>
          {showIconPlatform}
        </View>
        <View
          style={tw` flex-row my-4 bg-white border-[1.5px] rounded-md h-13 justify-between px-2 border-slate-300 items-center relative`}
        >
          <View>
            <RNPickerSelect
              onValueChange={handleCategoryChange}
              style={pickerSelectStyles}
              value={category}
              placeholder={{ label: "Select a category", value: null }}
              items={categories.map((category) => ({
                label: category,
                value: category,
              }))}
            />
          </View>
          {showIconPlatform}
        </View>
        {category && (
          <View
            style={tw` flex-row mb-5 bg-neutral-50 border-[1.5px] rounded-md h-13 justify-between px-2 border-slate-300 items-center relative`}
          >
            <View>
              <RNPickerSelect
                onValueChange={handleSubCategoryChange}
                style={pickerSelectStyles}
                value={sub_category}
                placeholder={{ label: "Select a subtype", value: null }}
                items={getAvailableSubtypes(category).map((subtype) => ({
                  label: subtype,
                  value: subtype,
                }))}
              />
            </View>
            {showIconPlatform}
          </View>
        )}
        {category && sub_category && (
          <DynamicForm
            fields={generateFieldsForCategory(category, sub_category)}
            onFieldChange={handleProductDetailsChange}
          />
        )}
        <Text style={{ color: "red" }}>{errors}</Text>
        <Button onPress={onSubmit} label={isUpdating ? "Update" : "Create"} />
        {isUpdating && (
          <Text onPress={confirmDelete} style={styles.textButton}>
            Delete
          </Text>
        )}
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#e1e1e1",
    padding: 10,
    height: 50,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    width: "100%",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "black",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    color: "black",
    paddingVertical: 10,
    width: width,
  },
  inputAndroid: {
    fontSize: 15,
    color: "black",
    paddingVertical: 10,
    paddingRight: width - 30,
  },
});