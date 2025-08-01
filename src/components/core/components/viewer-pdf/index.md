# ViewerPdf 组件

ViewerPdf 是一个基于 `react-pdf` 库的 PDF 文档查看器组件，支持在线预览 PDF 文件。

## 特性

- 支持 PDF 文件在线预览
- 支持自定义样式和类名
- 响应式设计，自适应容器宽度
- 优化性能，禁用文本层和注释层渲染
- 支持自定义加载和错误状态
- 支持多页 PDF 文档显示
- 支持缩放功能

## 基础用法

```tsx
import ViewerPdf from '@/components/core/components/viewer-pdf';

function App() {
  return <ViewerPdf file="https://example.com/document.pdf" />;
}
```

## 自定义样式

```tsx
import ViewerPdf from '@/components/core/components/viewer-pdf';

function App() {
  return (
    <ViewerPdf
      file="https://example.com/document.pdf"
      documentClassName="h-[600px] overflow-auto border border-gray-300"
      pageProps={{ className: 'border-2 border-blue-200' }}
    />
  );
}
```

## 自定义加载和错误状态

```tsx
import ViewerPdf from '@/components/core/components/viewer-pdf';

function App() {
  return (
    <ViewerPdf
      file="https://example.com/document.pdf"
      loading={<div className="text-blue-500">正在加载PDF文档...</div>}
      error={<div className="text-red-500">PDF文档加载失败，请重试</div>}
    />
  );
}
```

## 支持的文件类型

ViewerPdf 组件支持以下 PDF 文件来源：

```tsx
// URL 字符串
<ViewerPdf file="https://example.com/document.pdf" />

// File 对象
<ViewerPdf file={fileObject} />

// ArrayBuffer
<ViewerPdf file={arrayBuffer} />

// Base64 字符串
<ViewerPdf file="data:application/pdf;base64,..." />
```

## API

### ViewerPdfProps

| 属性                | 类型                                        | 默认值         | 说明          |
|-------------------|-------------------------------------------|-------------|-------------|
| file              | `string \| File \| ArrayBuffer`           | -           | PDF 文件源，必填  |
| className         | `string`                                  | -           | 自定义容器类名     |
| documentClassName | `string`                                  | -           | 文档类名        |
| loading           | `ReactNode`                               | `'加载中...'`  | 自定义加载状态显示内容 |
| error             | `ReactNode`                               | `'加载PDF失败'` | 自定义错误状态显示内容 |
| pageProps         | `Pick<PageProps, 'className' \| 'scale'>` | -           | 页属性         |
| toolBar           | `IToolBar`                                | -           | 工具栏         |

### PageProps

| 属性        | 类型       | 默认值 | 说明      |
|-----------|----------|-----|---------|
| className | `string` | -   | 自定义页面类名 |
| scale     | `number` | -   | 页面缩放比例  |

### IToolBar

```ts
type IToolBar =
  | boolean
  | {
      /** 工具栏类名 */
      className?: string;
      /** 缩放按钮类名 */
      zoomButtonClassName?: string;
      /** 重置缩放按钮类名 */
      resetZoomButtonClassName?: string;
    };
```

## 注意事项

1. **Worker 配置**: 组件已自动配置 PDF.js worker，无需额外设置
2. **性能优化**: 默认禁用了文本层和注释层渲染以提升性能
3. **响应式**: 页面宽度会自动适应容器宽度
4. **错误处理**: 加载错误会在控制台输出详细错误信息
5. **依赖要求**: 需要安装 `react-pdf` 依赖包

## 样式定制

### 使用 TailwindCSS 类

```tsx
<ViewerPdf
  file="document.pdf"
  documentClassName="bg-gray-50 p-4"
  pageProps={{ className: 'rounded-lg shadow-lg' }}
/>
```

## 常见问题

### Q: PDF 文件加载失败怎么办？

A: 请检查以下几点：

- 确保 PDF 文件 URL 可访问
- 检查跨域设置（CORS）
- 确认文件格式正确
- 查看浏览器控制台错误信息

### Q: 如何控制 PDF 显示尺寸？

A: 可以通过容器的 CSS 样式控制：

```tsx
<ViewerPdf file="document.pdf" className="w-[800px] h-[600px]" />
```

### Q: 支持移动端吗？

A: 是的，组件支持移动端显示，会自动适应屏幕宽度。
