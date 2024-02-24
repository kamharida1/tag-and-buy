import React, { useState } from "react";
import { View, Text, TextInput, Platform, StyleSheet, Dimensions, } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons } from "@expo/vector-icons";
import { InputField } from "../InputField";


interface DynamicFormField {
  label: string;
  type: "text" | "selection";
  options?: string[];
}

interface DynamicFormProps {
  fields: DynamicFormField[];
  onFieldChange: (field: string, value: string) => void;
}

const { width } = Dimensions.get("window");

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onFieldChange }) => {
  const showIconPlatform =
    Platform.OS === "android" ? (
      <></>
    ) : (
      <MaterialIcons
        style={styles.icon}
        name="keyboard-arrow-down"
        size={25}
        color="black"
      />
    );
  return (
    <View>
      {fields.map((field) => (
        <View key={field.label}>
          <Text style={{fontFamily: "airRegular"}}>{field.label}</Text>
          {field.type === "text" ? (
            // <Input
            //   onChangeText={(value) => onFieldChange(field.label, value)}
            // />
            <TextInput
              onChangeText={(value: string) =>
                onFieldChange(field.label, value)
              }
              placeholder="Enter text here"
              style={styles.input}
            />
          ) : (
            <RNPickerSelect
              onValueChange={(value: string) =>
                onFieldChange(field.label, value)
              }
              style={pickerSelectStyles}
              placeholder={{ label: "Select an option", value: null }}
              items={
                field.options?.map((option) => ({
                  label: option,
                  value: option,
                })) || []
              }
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    right: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    fontFamily: "airRegular",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    color: "black",
    paddingVertical: 10,
    width: width,
    fontFamily: "airRegular",
  },
  inputAndroid: {
    fontSize: 15,
    color: "black",
    paddingVertical: 10,
    paddingRight: width - 30,
  },
});

export default DynamicForm;
