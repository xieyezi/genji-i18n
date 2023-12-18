<h1 align="center">Incall<sup>  Cli</sup></h1>

## 初始化项目

> 目前支持 <code>typescript</code> , <code>vue3(h5)</code> , <code>react(pc)</code>, <code>react-native(微应用)</code>

```bash
pnpm create incall
or
yarn create incall
or
npm create incall
```

接着按照提示选择即可。

例如:

```shell
$ pnpm create incall
Packages: +6
++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: C:\Users\changan\.pnpm-store\v3
  Virtual store is at:             node_modules/.pnpm

C:\Users\changan\AppData\Local\Temp\dlx-13352\5:
+ create-incall 0.0.1

Progress: resolved 6, reused 6, downloaded 0, added 6, done
√ Project name: ... changan-project
√ Select a framework: » vue

Scaffolding project in E:\project\changan-auto-plugins\changan-project...

Done. Now run:

  cd changan-project
  pnpm install
  pnpm run dev
```

:::tip
使用 react-native template 只支持在 `incall-react-native-monorepo` 项目根目录初始化.

如果要单独创建新的 react-native 项目, 请执行如下命令:

`npx react-native init appName --template react-native-template-incall`
:::

## 配置项目

现在可以在项目根目录通过 `incall.config.ts` 文件来配置每个 SDK:

```ts
import { defineConfig } from "incall-cli";

export default defineConfig({
  qiyuan: {
   ...
  },
  uni: {
   ...
  }，
  kaicheng: {
   ...
  }，
});
```

通过 `incall-cli` 导出的 `defineConfig` 函数, 对每个 SDK 进行单独配置。

SDK 可选项有:

```ts
type SDKConfig = {
  incall?: {...};
  overseas?: {...};
  changanauto?: {...};
  kaicheng?: {...};
  qiyuan?: {...};
  oshin?: {...};
  uni?: {...};
};
```

对于每个 SDK, 可以设置 `microApp` 参数以及 `theme` 参数. 其中 `microApp` 表示该 SDK 装载哪些微应用, `theme` 则表示对该 SDK 的主题进行个性化配置:

```ts{4,10}
...
  qiyuan: {
    // 表示qiyuan sdk 装载了 carList, carMessage, cartest 微应用
    microApp: {
      carList: true,
      carMessage: true,
      cartest: true,
    },
    // 分别设置 light 和 dark 的主题
    theme: {
      light: {
        primaryColor: "#005FA5"
      },
      dark: {}
    }
  }
...
```

下面是一个完整的配置示例:

```ts
import { defineConfig } from "incall-cli";

export default defineConfig({
  qiyuan: {
    microApp: {
      carList: true,
      carMessage: true,
      cartest: true,
      cloudRobot: true
    },
    theme: {
      light: {
        primaryColor: "#005FA5",
        successColor: "#00B379",
        dangerColor: "#E64049",
        warningColor: "#FFB30F"
      },
      dark: {}
    }
  },
  uni: {
    microApp: {
      cartest: true
    },
    theme: {
      light: {
        primaryColor: "#005FA5",
        successColor: "#00B379",
        dangerColor: "#E64049",
        warningColor: "#FFB30F"
      },
      dark: {}
    }
  },
  kaicheng: {
    microApp: {
      cartest: true
    },
    theme: {
      light: {
        primaryColor: "#005FA5",
        successColor: "#00B379",
        dangerColor: "#E64049",
        warningColor: "#FFB30F"
      },
      dark: {}
    }
  }
});
```

## 运行微应用

```bash
incall-cli dev appName microAppName
incall-cli  serve appName microAppName
```

例如:

```bash
incall-cli serve qiyuan carList // 运行启源 sdk 的 carList 微应用
```

`appName` 的可选值有:

```ts
type AppName = "uni" | "oshin" | "incall" | "qiyuan" | "kaicheng" | "changanauto";
```

## 打包微应用

打包某个微应用,测试模式

```bash
incall-cli build:test appName microAppName
```

打包某个微应用,生产模式

```bash
incall-cli build:prod appName microAppName
```

一键打包全部微应用,生产模式

```bash
incall-cli buildAll:prod appName
```

一键打包全部微应用,测试模式

```bash
incall-cli buildAll:test appName
```

`appName` 的可选值有:

```ts
type AppName = "uni" | "oshin" | "incall" | "qiyuan" | "kaicheng" | "changanauto";
```

## 热更新

如果微应用是 vue3 版本, 当我们编辑 `incall.cofig.ts` 文件时, 那么将自动开启热更新（即编辑自动重新运行）.

如果是 vue2 的版本,暂无法支持热更新. vue2 是基于 webpack 的版本，而且 webpack 版本较老，所以无法支持手动调用 `incall.cofig.ts` 热更新. 所以在编辑`incall.cofig.ts`之后，需要重新启动微应用.

## CSS 变量注入

当你在 `incall.config.ts` 配置了 `theme` 属性时，`incall-cli` 会自动将你配置的 CSS 变量注入到 `:root` 下面.

这是一个例子:

```ts {7,8,11,12}
export default defineConfig({
  qiyuan: {
    microApp: {
      carList: true
    theme: {
      light: {
        primaryColor: "#005FA5",
        successColor: "#00B379",
      },
      dark: {
        primaryColor: "#00B379",
        successColor: "#005FA5",
      }
    }
  }
  ...
});
```

会自动注入如下 CSS 变量:

```css
:root {
  --incall-primary-color: #005fa5;
  --incall-success-color: #00b379;
}

.incall-theme-dark {
  --incall-primary-color: #00b379;
  --incall-success-color: #005fa5;
}
```

### CSS 变量注入说明

- `incall-cli` 会为每个 CSS 变量加入 `--incall-的前缀`
- `light`属性下面的 CSS 变量会挂载在 `:root`
- `dark`属性下面的 CSS 变量会挂载在 `.incall-theme-dark`

接下来, 就可以在微应用中使用 CSS 变量:

```css
<style>
.container {
  background-color: var(--incall-primary-color);
}
</style>
```

### 黑夜模式

`incall-cli` 会将 `dark` CSS 变量注入到`.incall-theme-dark`, 当你需要使用黑夜模式时, 可以在 `html` 标签添加 `.incall-theme-dark` 的 class, 即可使用黑暗主题的 CSS 变量:

```html
<html class="incall-theme-dark">
  ...
</html>
```

```css
<style>
.incall-theme-dark .container {
  background-color: var(--incall-primary-color);
}
</style>
```

### CSS 变量书写规范

:::warning
书写自定义 CSS 变量时，必须采用大驼峰式写法, 例如 `primaryColor`, `successColor`.
:::

## 运行时 Hook

为了对多个 `sdk`进行统一维护, `incal-cli` 在编译时会自动注入环境变量到微应用中.

## useAppName

获取当前 sdk 的 name

```ts
import { useAppName } from "incall-cli";

const appName = useAppName();
const pageTitle = computed(() => {
  if (appName === "qiyuan") return "启源";
});
```

## useAppType

获取是否为指定 sdk

```ts
import { useAppType } from "incall-cli";

const { isQiYuan, isChanganAuto, isKaiCheng, isOshin, isOverseas, isUni, isIncall } = useAppType();

console.log(isQiYuan, isChanganAuto, isKaiCheng, isOshin, isOverseas, isUni, isIncall);
```

## useAppTheme

获取当前 sdk 的 theme

```ts
import { useAppTheme } from "incall-cli";
const theme = useAppTheme();
```

theme 的类型如下:

```ts
type AppTheme = {
  light?: Record<string, string>;
  dark?: Record<string, string>;
};
```

## useSdkAppType

获取当前 sdk 的 sdkAppType

> sdkAppType: 和原生通信的 key

```ts
import { useSdkAppType } from "incall-cli";

const sdkAppType = useSdkAppType();

console.log(sdkAppType);
```
