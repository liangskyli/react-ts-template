# PdfViewer PDF 查看器

PdfViewer 是一个基于 `@embedpdf/react-pdf-viewer` 的 PDF 文档查看器组件，支持在线预览 PDF 文件，提供丰富的查看和交互功能。

## 特性

- 支持 PDF 文件在线预览
- 支持缩放功能（适应页面宽度、自定义缩放级别）
- 可选的缩放工具栏
- 基于 Pdfium 引擎，性能优异
- 支持平滑滚动浏览
- 响应式设计，自适应容器尺寸
- 支持自定义插件配置

## 代码演示

### 基础用法

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer url="https://example.com/document.pdf" />
);
```

### 显示缩放工具栏

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    toolBar={true}
  />
);
```

### 自定义容器样式

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    className="h-[800px] w-full"
  />
);
```

### 自定义缩放配置

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    zoomPluginConfig={{
      defaultZoomLevel: ZoomMode.FitHeight,
      minZoom: 0.5,
      maxZoom: 3,
    }}
  />
);
```

### 自定义工具栏样式

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    toolBar={{
      className: 'bg-blue-100',
      zoomButtonClassName: 'text-blue-600',
      resetZoomButtonClassName: 'font-bold',
    }}
  />
);
```

### 自定义加载提示文本

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    loadingText="正在加载 PDF..."
  />
);
```

### 自定义错误提示

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    loadError="PDF 加载失败，请重试"
  />
);
```

### 自定义错误提示元素

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    loadError={
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          <p>PDF 加载失败</p>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      </div>
    }
  />
);
```

### 完整配置示例

```tsx
import PdfViewer from '@/components/core/components/pdf-viewer';

export default () => (
  <PdfViewer
    url="https://example.com/document.pdf"
    className="h-screen w-full"
    documentWrapClassName="bg-gray-50"
    viewportClassName="p-4"
    toolBar={{
      className: 'shadow-md',
      zoomButtonClassName: 'hover:bg-gray-200',
    }}
    loadingText="正在初始化..."
    viewportPluginConfig={{
      viewportGap: 20,
    }}
    scrollPluginConfig={{
      defaultPageGap: 20,
    }}
    zoomPluginConfig={{
      defaultZoomLevel: ZoomMode.FitWidth,
      minZoom: 0.2,
      maxZoom: 3,
    }}
  />
);
```

## API

### PDFViewerProps

| 属性 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| `url` | PDF 文件的 URL 地址 | `string` | - | 是 |
| `className` | 外层容器类名 | `string` | - | 否 |
| `documentWrapClassName` | 文档包裹容器类名 | `string` | - | 否 |
| `viewportClassName` | 视口容器类名 | `string` | - | 否 |
| `toolBar` | 是否显示工具栏或工具栏样式配置 | `boolean \| IToolBarClassName` | `false` | 否 |
| `loadingText` | 加载提示文本 | `ReactNode` | `'加载中...'` | 否 |
| `loadError` | 加载失败提示，可以是文本或 React 元素 | `ReactNode` | `'加载PDF失败'` | 否 |
| `viewportPluginConfig` | Viewport 插件配置 | `Partial<ViewportPluginConfig>` | `{ viewportGap: 10 }` | 否 |
| `scrollPluginConfig` | Scroll 插件配置 | `Partial<ScrollPluginConfig>` | `{ defaultPageGap: 10 }` | 否 |
| `zoomPluginConfig` | Zoom 插件配置 | `Partial<ZoomPluginConfig>` | 见下方默认配置 | 否 |

### IToolBarClassName

工具栏样式配置对象，当 `toolBar` 为对象时使用：

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `className` | 工具栏容器类名 | `string` |
| `zoomButtonClassName` | 缩放按钮类名 | `string` |
| `resetZoomButtonClassName` | 重置缩放按钮类名 | `string` |

### ZoomPluginConfig 默认值

```tsx
{
  defaultZoomLevel: ZoomMode.FitWidth,  // 默认适应页面宽度
  minZoom: 0.2,                          // 最小缩放 20%
  maxZoom: 2,                            // 最大缩放 200%
}
```

**注意**：传入的 `zoomPluginConfig` 会与默认配置进行浅合并，可以只覆盖部分配置项。

### ZoomMode 枚举

ZoomMode 提供以下预定义的缩放模式：

- `ZoomMode.FitWidth`: 适应页面宽度
- `ZoomMode.FitHeight`: 适应页面高度
- `ZoomMode.ActualSize`: 实际尺寸（100%）

## 样式定制

PdfViewer 使用 Tailwind CSS 进行样式设置，提供了多层级的样式定制能力：

### 容器层级样式

```tsx
<PdfViewer
  url="document.pdf"
  className="h-[600px] w-full border border-gray-300 rounded-lg"     // 外层容器
  documentWrapClassName="bg-gray-50"                                // 文档包裹层
  viewportClassName="p-4"                                           // 视口层
/>
```

### 工具栏样式定制

```tsx
<PdfViewer
  url="document.pdf"
  toolBar={{
    className: 'bg-white shadow-md border-b',           // 工具栏容器
    zoomButtonClassName: 'px-3 py-2 rounded hover:bg-gray-100',  // 缩放按钮
    resetZoomButtonClassName: 'min-w-[60px] font-mono',          // 重置按钮
  }}
/>
```

## 组件结构

PdfViewer 组件内部使用了以下插件：

1. **DocumentManager**: 管理文档加载和状态
2. **Viewport**: 提供视口管理功能
3. **Scroll**: 支持平滑滚动浏览
4. **Render**: 负责页面渲染
5. **Zoom**: 提供缩放功能

## 容器层级说明

```
PdfViewer (className)
  └── DocumentWrap (documentWrapClassName)
        ├── ZoomToolbar (toolBar.className)
        └── Viewport (viewportClassName)
              └── Scroller
                    └── RenderLayer
```

## 加载状态

组件在加载 PDF 引擎时会显示加载提示，可通过 `loadingText` 自定义：

```tsx
// 默认提示
<PdfViewer url="document.pdf" />
// 显示: 加载中...

// 自定义提示
<PdfViewer url="document.pdf" loadingText="正在初始化 PDF 引擎..." />
// 显示: 正在初始化 PDF 引擎...
```

## 错误状态

当 PDF 引擎加载失败或文档加载出错时，会显示错误提示，可通过 `loadError` 自定义：

```tsx
// 默认错误提示
<PdfViewer url="document.pdf" />
// 显示: 加载PDF失败

// 自定义错误文本
<PdfViewer url="document.pdf" loadError="PDF 文件加载失败，请检查网络连接" />
// 显示: PDF 文件加载失败，请检查网络连接

// 自定义错误元素（可以添加重试按钮等交互元素）
<PdfViewer
  url="document.pdf"
  loadError={
    <div className="error-container">
      <p className="error-message">PDF 加载失败</p>
      <button onClick={() => window.location.reload()}>重新加载</button>
    </div>
  }
/>
```

**错误触发场景**：
1. PDF 引擎初始化失败
2. PDF 文档加载失败
3. PDF 文件格式错误
4. 网络连接问题

## 工具栏

### 显示/隐藏工具栏

```tsx
// 不显示工具栏（默认）
<PdfViewer url="document.pdf" />

// 显示工具栏（使用默认样式）
<PdfViewer url="document.pdf" toolBar={true} />

// 显示工具栏（自定义样式）
<PdfViewer
  url="document.pdf"
  toolBar={{
    className: 'custom-toolbar-class',
  }}
/>
```

### 工具栏功能

- **缩放按钮**: 放大和缩小 PDF 视图
- **重置按钮**: 显示当前缩放比例，点击可恢复到默认缩放级别
- **禁用状态**: 当达到最小/最大缩放级别时，相应的缩放按钮会自动禁用

## 注意事项

1. **引擎初始化**: 组件使用 `usePdfiumEngine` hook 初始化 Pdfium 引擎，首次加载可能需要一些时间
2. **URL 要求**: `url` 属性必须是可访问的 PDF 文件 URL
3. **性能优化**: 组件已针对性能进行优化，使用虚拟化和按需渲染
4. **响应式**: 组件会自动适应容器尺寸，建议设置容器的高度
5. **依赖要求**: 需要安装 `@embedpdf/react-pdf-viewer` 相关依赖包
6. **样式隔离**: 使用 `class-config.ts` 管理样式，避免样式冲突

## 常见问题

### Q: 如何调整页面间距？

A: 可以通过 `viewportPluginConfig` 和 `scrollPluginConfig` 调整：

```tsx
<PdfViewer
  url="document.pdf"
  viewportPluginConfig={{ viewportGap: 20 }}
  scrollPluginConfig={{ defaultPageGap: 20 }}
/>
```

### Q: 如何设置默认缩放级别？

A: 通过 `zoomPluginConfig.defaultZoomLevel` 设置：

```tsx
<PdfViewer
  url="document.pdf"
  zoomPluginConfig={{
    defaultZoomLevel: ZoomMode.FitHeight,
  }}
/>
```

### Q: 组件支持哪些缩放范围？

A: 默认支持 0.2x 到 2x 的缩放范围，可以通过 `minZoom` 和 `maxZoom` 自定义：

```tsx
<PdfViewer
  url="document.pdf"
  zoomPluginConfig={{
    minZoom: 0.5,  // 最小 50%
    maxZoom: 3,    // 最大 300%
  }}
/>
```

### Q: 如何自定义工具栏的按钮样式？

A: 使用 `toolBar` 对象配置：

```tsx
<PdfViewer
  url="document.pdf"
  toolBar={{
    zoomButtonClassName: 'bg-blue-500 text-white',
    resetZoomButtonClassName: 'bg-green-500 text-white',
  }}
/>
```

### Q: 如何为不同层级设置不同的背景色？

A: 使用多层级的 className 配置：

```tsx
<PdfViewer
  url="document.pdf"
  className="bg-blue-50"              // 外层容器
  documentWrapClassName="bg-green-50" // 文档包裹层
  viewportClassName="bg-yellow-50"    // 视口层
/>
```

### Q: 如何隐藏工具栏？

A: 不传 `toolBar` 属性或设置为 `false`（默认为 false）：

```tsx
<PdfViewer url="document.pdf" />
// 或
<PdfViewer url="document.pdf" toolBar={false} />
```

## 相关组件

- `ZoomToolbar`: 缩放工具栏组件，提供放大、缩小、重置等缩放控制功能