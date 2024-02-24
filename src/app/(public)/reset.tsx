import { View, Text } from 'react-native'
import React, { useState } from 'react'
import * as Yup from "yup";
import { Field } from "formik";
import { style as tw } from 'twrnc';
import { MotiText, MotiView } from 'moti';
import AppForm from '@/components/AppForm';
import { InputField } from '@/components/InputField';
import { ButtonSubmit } from '@/components/ButtonSubmit';
import { useSignIn } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  code: Yup.string().required(),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required")
    .label("Password"),
});

const Reset = () => {
  const { signIn, setActive } = useSignIn();

  const [successfulCreation, setSuccessfulCreation] = useState(true);
  const [loading, setLoading] = React.useState(false);

  const onRequestReset = async (values: { email: string }) => {
    const { email } = values;
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async (values: { code: string; password: string }) => {
    const { code, password } = values;
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Password reset successfully");

      // Set the user session active, which will log in the user automatically
      await setActive!({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <MotiView style={tw(`flex-1 bg-white px-6`)}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {successfulCreation && (
        <>
          <MotiView style={tw(`mt-4 mb-10`)}>
            <MotiText
              style={
                {...tw(`text-[17px] text-center font-medium text-stone-800`),fontFamily: 'airMedium',}
              }
            >
              Enter your email addresss.
            </MotiText>
          </MotiView>
          <AppForm
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={onRequestReset}
          >
            <Field
              component={InputField}
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoFocus
            />
            <ButtonSubmit
              title="Send Reset Link"
              loading={loading}
              style={tw(`mt-3`)}
            />
          </AppForm>
        </>
      )}

      {!successfulCreation && (
        <>
          <MotiView style={tw(`mt-4 mb-10`)}>
            <MotiText
              style={{
                ...tw(`text-[15px] text-stone-900`),
              fontFamily: 'airMedium',
              }}
            >
              Enter the code you received and your new password.
            </MotiText>
          </MotiView>
          <AppForm
            initialValues={{ code: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={onReset}
          >
            <Field
              component={InputField}
              name="code"
              placeholder="Code"
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="oneTimeCode"
              autoFocus
            />
            <Field
              component={InputField}
              name="password"
              placeholder="Password"
              placeholderTextColor="#777"
              autoCapitalize="none"
              isPassword
              autoCorrect={false}
              textContentType="password"
            />
            <ButtonSubmit
              title="Reset Password"
              loading={loading}
              style={tw(`mt-3`)}
            />
          </AppForm>
        </>
      )}
    </MotiView>
  );
}

export default Reset