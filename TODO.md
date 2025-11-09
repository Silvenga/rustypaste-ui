## Features

### Global

- [ ] [Expiration (Header)](https://github.com/orhun/rustypaste#expiration)
- [ ] [Override URL (Form Parameter)](https://github.com/orhun/rustypaste#override-the-filename-when-using-random_url)

### Upload

```shell
curl -F "file=@x.txt" "<server_address>"
```

- [ ] Oneshot (Form Parameter, oneshot).
- [X] Submit
- [X] Progress
- [X] Streaming
- [X] Show Result

### URL Shortening

```shell
curl -F "url=https://example.com/some/long/url" "<server_address>"
```

- [ ] Oneshot (Form Parameter, oneshot_url).
- [ ] URL validation.
- [ ] Submit
- [ ] Show Result

### Remote Upload

```shell
curl -F "remote=https://example.com/file.png" "<server_address>"
```

- [ ] Submit
- [ ] Show Result

### List

```shell
curl "http://<server_address>/list"

[{"file_name":"accepted-cicada.txt","file_size":241,"expires_at_utc":null}]
```

- [X] List
- [X] Delete
