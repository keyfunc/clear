# Changelog

## [1.0.0]

### Added
- 发布 `create-clear` 第一个正式版本。
- 支持从远程 `templates.json` 获取模板列表。
- 支持交互式选择模板并使用 `tiged` 拉取项目模板。
- 支持目标目录存在时二次确认覆盖。
- 优化命令行展示，提供中文提示和创建完成后的下一步指引。

### Changed
- 使用 `path.resolve` 生成目标目录路径。
- 将 Node.js 支持范围统一为 `>=18.0.0`。
