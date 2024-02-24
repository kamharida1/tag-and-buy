import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { MotiView } from "moti";
import Colors from "../../constants/Colors";
import { style as tw } from "twrnc";
import { InputField } from "@/components/InputField";
import { Loader } from "@/components/Loader";
import * as Yup from "yup";
import { Field } from "formik";
import AppForm from "@/components/AppForm";
import { TouchableOpacity } from "react-native-gesture-handler";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import ButtonOutline from "@/components/ButtonOutline";
import { Link, router } from "expo-router";
import { ButtonSubmit } from "@/components/ButtonSubmit";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter valid email")
    .label("Email"),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required")
    .label("Password"),
});

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [loading, setLoading] = useState(false);
  const [ userInfo ] = useState({ email: "", password: "" });

  const onSelectAuth = async (strategy: Strategy) => { }

  const handleSignIn = async (values: {
    email: string;
    password: string;
  }) => {
    const { email, password } = values;

    if (!isLoaded) return;

    setLoading(true);
    try { 
      const completeSignIn = await signIn.create({
        identifier: email,
        password: password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    } 
  };

  return (
    <MotiView style={tw(`flex-1 bg-white p-6`)}>
      <AppForm
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={handleSignIn}
      >
        <Field
          component={InputField}
          name="email"
          placeholder="agubiggest@gmail.com"
          placeholderTextColor="#777"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          isPassword={false}
          // onBlur={() => setFieldTouched("email")}
          // onChangeText={handleChange("email")}
        />
        <Field
          name="password"
          component={InputField}
          placeholder="Password"
          placeholderTextColor="#777"
          autoCapitalize="none"
          isPassword
          autoCorrect={false}
          textContentType="password"
          // onBlur={() => setFieldTouched("password")}
          // onChangeText={handleChange("password")}
        />

        <Link href="/reset" asChild>
          <Pressable style={tw(`mb-8 items-start`)}>
            <Text style={{
              fontFamily: 'airMedium',
              textDecorationLine: 'underline',
              fontSize: 15,
            }}>
              Forgot password?
            </Text>
          </Pressable>
        </Link>

        <ButtonSubmit
          style={{
            alignSelf: "center",
            height: 54,
            width: 380,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 80,
            marginBottom: 20,
            backgroundColor: "rgba(0, 121, 88, 0.95)",
          }}
          textStyle={{
            color: "white",
            //fontSize: 18,
            fontFamily: "airMedium",
            letterSpacing: 0.4,
          }}
          loading={loading}
          title="Continue"
        />

        <View style={styles.seperatorView}>
          <View
            style={{
              flex: 1,
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={[styles.seperator, {fontFamily: "airBold"}]}>or</Text>
          <View
            style={{
              flex: 1,
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>

        <View style={{ gap: 20 }}>
          <ButtonOutline onPress={() => router.push("/(public)/register")}>
            <Ionicons
              name="mail-outline"
              size={24}
              style={defaultStyles.btnIcon}
            />
            <Text style={[styles.btnOutlineText, { fontFamily: "airMedium" }]}>
              Continue with Email
            </Text>
          </ButtonOutline>

          <ButtonOutline onPress={() => onSelectAuth(Strategy.Apple)}>
            <Ionicons
              name="md-logo-apple"
              size={24}
              style={defaultStyles.btnIcon}
            />
            <Text style={[styles.btnOutlineText, { fontFamily: "airMedium" }]}>
              Continue with Apple
            </Text>
          </ButtonOutline>
          <ButtonOutline onPress={() => onSelectAuth(Strategy.Google)}>
            <Ionicons
              name="md-logo-google"
              size={24}
              style={defaultStyles.btnIcon}
            />
            <Text style={[styles.btnOutlineText, { fontFamily: "airMedium" }]}>
              Continue with Google
            </Text>
          </ButtonOutline>
          <ButtonOutline onPress={() => onSelectAuth(Strategy.Facebook)}>
            <Ionicons
              name="md-logo-facebook"
              size={24}
              style={defaultStyles.btnIcon}
            />
            <Text style={[styles.btnOutlineText, { fontFamily: "airMedium" }]}>
              Continue with Facebook
            </Text>
          </ButtonOutline>
        </View>
      </AppForm>
    </MotiView>
  );
};

export default Login;

const styles = StyleSheet.create({
  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    //fontFamily: "mon-sb",
    color: Colors.light.tabIconSelected,
    fontSize: 16,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    //fontFamily: "mon-sb",
  },
});
