    @PostMapping("upload")
    public Map<String, Object> fileUpload(MultipartFile file, String path, Long id) throws IOException {
        Account account = (Account) redisTemplate.opsForValue().get("account_" + id);
        assert account != null;
        String filename = file.getOriginalFilename();
        assert filename != null;
        String[] suffix = filename.split("\\.");
        int suffixIndex = suffix.length - 1;
        String name = UUIDUtils.getUUID() + "." + suffix[suffixIndex];
        Double size = (file.getSize() / 1024.0);
        Files files = new Files();
        files.setUid(id);
        files.setFilename(filename);
        files.setFilepath(uploadPath + name);
        files.setFilesize(size);
        files.setFolder(path);
        Map<String, Object> map = new HashMap<>();
        if (fileService.save(files)) {
            file.transferTo(new File(uploadPath + name));
            map.put(ResponseService.CODE, 200);
            map.put(ResponseService.SUCCESS, true);
            map.put(ResponseService.MESSAGE, "上传成功");
            map.put("filepath", uploadPath + name);
        } else {
            map.put(ResponseService.CODE, 510);
            map.put(ResponseService.SUCCESS, false);
            map.put(ResponseService.MESSAGE, "上传失败");
        }
        return map;
    }