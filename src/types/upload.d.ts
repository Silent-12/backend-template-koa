/**
 * @description 定义上传文件信息结构。
 */
export interface UploadFile {
  // 上传后的新文件名
  newFilename: string;
  // 文件的 MIME 类型
  mimetype: string;
}
