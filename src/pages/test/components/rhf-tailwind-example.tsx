/*
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/utils/styles.ts";

// 定义表单验证模式
const formSchema = z.object({
  name: z.string().min(3, "名称至少3个字符"),
  email: z.string().email("请输入有效的邮箱"),
  role: z.string().min(1, "请选择角色"),
  message: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "必须接受条款" }),
  }),
});

export default function TailwindFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      message: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    alert("表单提交成功: " + JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        {/!* 名称字段 *!/}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名称
          </label>
          <input
            id="name"
            {...register("name")}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.name ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/!* 邮箱字段 *!/}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.email ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/!* 角色选择 *!/}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            角色
          </label>
          <select
            id="role"
            {...register("role")}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.role ? "border-red-500" : "border-gray-300"
            )}
          >
            <option value="">选择角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
            <option value="editor">编辑</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/!* 消息字段 *!/}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            消息 (可选)
          </label>
          <textarea
            id="message"
            {...register("message")}
            rows={4}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.message ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/!* 条款复选框 *!/}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              {...register("terms")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              我同意服务条款和隐私政策
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>
        </div>

        {/!* 提交按钮 *!/}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600",
            "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? "提交中..." : "提交"}
        </button>
      </div>
    </form>
  );
}*/
