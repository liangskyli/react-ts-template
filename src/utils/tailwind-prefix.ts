// 从 tailwind.config.js 中获取前缀
// 注意：这种方式在构建时会将前缀值硬编码到代码中
// @ts-expect-error ignore type
import { prefix as tailwindPrefix } from '../../tailwind.config.js';

// Tailwind 类名的正则表达式模式
// 这个正则表达式匹配 Tailwind 的类名格式
const TAILWIND_PATTERN = /^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|disabled:|before:|after:|-?[a-z]+-[a-z0-9]+)/;

/**
 * 判断一个类名是否是 Tailwind 类名
 * @param className 要检查的类名
 * @returns 是否是 Tailwind 类名
 */
export function isTailwindClass(className: string): boolean {
  return TAILWIND_PATTERN.test(className);
}

/**
 * 为 Tailwind 类名添加前缀
 * @param className 单个类名
 * @returns 添加了前缀的类名
 */
export function addPrefixToClass(className: string): string {
  // 如果没有配置前缀或者类名为空，直接返回原类名
  if (!tailwindPrefix || !className) return className;

  // 如果已经有前缀，直接返回
  if (className.startsWith(tailwindPrefix)) return className;

  // 如果是 Tailwind 类名，添加前缀
  if (isTailwindClass(className)) {
    return `${tailwindPrefix}${className}`;
  }

  // 非 Tailwind 类名不处理
  return className;
}

/**
 * 为包含多个类名的字符串添加前缀
 * @param classNames 类名字符串，多个类名用空格分隔
 * @returns 处理后的类名字符串
 */
export function addPrefix(classNames: string): string {
  // 如果没有配置前缀或者类名为空，直接返回原类名
  if (!tailwindPrefix || !classNames) return classNames;

  // 分割类名字符串，为每个 Tailwind 类名添加前缀
  return classNames
    .split(' ')
    .map(cls => cls.trim())
    .filter(Boolean)
    .map(addPrefixToClass)
    .join(' ');
}
