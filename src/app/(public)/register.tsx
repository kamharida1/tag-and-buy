import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo';
import * as Yup from "yup";
import { Field } from "formik";
import { MotiText, MotiView } from 'moti';
import { style as tw } from 'twrnc';
import AppForm from '@/components/AppForm';
import { InputField } from '@/components/InputField';
import { Link } from 'expo-router';
import { ButtonSubmit } from '@/components/ButtonSubmit';
import Colors from '@/constants/Colors';
import {ButtonOutline} from '@/components/ButtonOutline';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import AppText from '@/components/AppText';

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  //name: Yup.string().required("Name is required").label("Name"),
  email: Yup.string()
    .email("Please enter valid email")
    .required("Email is required")
    .label("Email"),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required")
    .label("Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required")
    .label("Confirm Password"),
});

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSelectAuth = async (strategy: Strategy) => {};

  const handleSignUp = async (values: FormValues) => {
    const { email, password } = values;
    if (!isLoaded) return;
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      // Send the verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message)
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (values: { code: string }) => { 
    const { code } = values;
    if (!isLoaded) return;
    setLoading(true);
    
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MotiView style={tw(`flex-1 bg-white px-6`)}>
      <View style={{}}>
        <MotiText
          style={tw(`text-3xl  font-bold text-center text-zinc-700`)}
          from={{ opacity: 0, translateY: 0 }}
          animate={{ opacity: 1, translateY: 20 }}
          transition={{ type: "spring", stiffness: 90, damping: 8 }}
        >
          Sign Up
        </MotiText>
        <Text style={tw(`px-4 pt-8 text-center `)}>
          {pendingVerification ? " " : "Enter your credentials to signup"}
        </Text>
      </View>

      <MotiView
        style={tw(` justify-center`)}
        from={{ opacity: 0, translateY: 0 }}
        animate={{ opacity: 1, translateY: 20 }}
        transition={{ type: "timing", duration: 200 }}
      >
        {!pendingVerification && (
          <>
            <AppForm
              initialValues={{ email: "", password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignUp}
            >
              <Field
                component={InputField}
                name="email"
                placeholder="aguiggest@gmail.com"
                placeholderTextColor="#777"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                isPassword={false}
                style={{ borderBottomColor: "#ccc" }}
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
              <Field
                name="confirmPassword"
                component={InputField}
                placeholder="Confirm Password"
                placeholderTextColor="#777"
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
              />
              <MotiView style={tw(`items-center mb-7`)}>
                <Link
                  href="/login"
                  style={tw(`text-sm underline text-stone-800`)}
                >
                  Already have an account? Login, instead.
                </Link>
              </MotiView>
              <ButtonSubmit title={loading ? "Creating user..." : "Sign Up"} />

              <View style={styles.seperatorView}>
                <View
                  style={{
                    flex: 1,
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
                <Text style={styles.seperator}>or</Text>
                <View
                  style={{
                    flex: 1,
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
              </View>

              <View style={{ gap: 20 }}>
                <Pressable
                  style={tw(
                    `items-center justify-center gap-5 flex-row w-full border p-3 border-green-900 rounded-full`
                  )}
                  onPress={() => onSelectAuth(Strategy.Apple)}
                >
                  <Ionicons name="md-logo-apple" size={24} />
                  <AppText fontFamily="airMedium" style={styles.btnOutlineText}>
                    Continue with Apple
                  </AppText>
                </Pressable>
                <Pressable
                  style={tw(
                    `items-center justify-center gap-5 flex-row w-full border p-3 border-green-900 rounded-full`
                  )}
                  onPress={() => onSelectAuth(Strategy.Google)}
                >
                  <Ionicons name="md-logo-google" size={24} />
                  <AppText fontFamily="airMedium" style={styles.btnOutlineText}>
                    Continue with Google
                  </AppText>
                </Pressable>
                <Pressable
                  style={tw(
                    `items-center justify-center gap-5 flex-row w-full border p-3 border-green-900 rounded-full`
                  )}
                  onPress={() => onSelectAuth(Strategy.Facebook)}
                >
                  <Ionicons name="md-logo-facebook" size={24} />
                  <AppText fontFamily="airMedium" style={styles.btnOutlineText}>
                    Continue with Facebook
                  </AppText>
                </Pressable>
              </View>
            </AppForm>
          </>
        )}

        {pendingVerification && (
          <>
            <MotiView style={tw(`items-center mb-7`)}>
              <Text style={tw(`text-sm text-neutral-900 font-medium `)}>
                Check your email for a verification code
              </Text>
            </MotiView>
            <AppForm initialValues={{ code: "" }} onSubmit={onPressVerify}>
              <Field
                component={InputField}
                name="code"
                placeholder="Verification code"
                placeholderTextColor="#777"
                autoCapitalize="none"
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                isPassword={false}
                style={{ borderBottomColor: "#ccc" }}
                // onBlur={() => setFieldTouched("email")}
                // onChangeText={handleChange("email")}
              />
              <ButtonSubmit title={loading ? "Verifying..." : "Verify"} />
            </AppForm>
          </>
        )}
      </MotiView>
    </MotiView>
  );
}

export default Register;

const styles = StyleSheet.create({
  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    //fontFamily: "mon-sb",
  },
  seperator: {
    //fontFamily: "mon-sb",
    color: Colors.light.tabIconSelected,
    fontSize: 16,
  },
});