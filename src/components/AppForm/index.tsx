import React from "react";
import { Formik } from "formik";
const AppForm = ({
  initialValues,
  onSubmit,
  validationSchema,
    
  children,
}: any) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        setFieldTouched,
        isValid,
        dirty,
        ...rest 
      }) => <>{children}</>}
    </Formik>
  );
};
export default AppForm;
