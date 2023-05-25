***

### Vue4EasyDrive



<img decoding="async" src="https://f005.backblazeb2.com/file/img-forWeb/uPic/icons8-mcdonald%60s-french-fries-480.png" width="40%">

```java
@GetMapping("show")
    public void downloadRecycle(String path, HttpServletResponse response) throws IOException {
        File file = new File(path);
        System.out.println(path);
        try {
            FileInputStream inputStream = new FileInputStream(file);
            QueryWrapper<Recycle> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("filepath", path);
            Recycle recycle = recycleService.getOne(queryWrapper);
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Disposition", "attachment;filename=" + new String(recycle.getFilename().getBytes(), StandardCharsets.ISO_8859_1));
            byte[] bytes = new byte[256 * 1024];
            int readCount = 0;
            while ((readCount = inputStream.read(bytes)) != -1) {
                response.getOutputStream().write(bytes, 0, readCount);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        response.getOutputStream().flush();
    }
```