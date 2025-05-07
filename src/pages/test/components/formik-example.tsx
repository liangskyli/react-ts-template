/*
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/button";

// 定义验证模式
const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "名字太短!")
    .max(50, "名字太长!")
    .required("必填项"),
  lastName: Yup.string()
    .min(2, "姓氏太短!")
    .max(50, "姓氏太长!")
    .required("必填项"),
  email: Yup.string().email("无效的邮箱").required("必填项"),
  password: Yup.string()
    .min(6, "密码至少6个字符")
    .required("必填项"),
});

export default function FormikExample() {
  return (
    <div className="w-full max-w-md">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await new Promise(r => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">名字</label>
              <Field name="firstName" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">姓氏</label>
              <Field name="lastName" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <Field name="email" type="email" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">密码</label>
              <Field name="password" type="password" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "提交中..." : "提交"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
*/
