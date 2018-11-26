# Using Docker to generate keys

If you are having problems generating keys from your native OS, you can try using the Docker container [frapsoft/openssl](https://hub.docker.com/r/frapsoft/openssl/).

After installing the container, you can issue the following commands: -

```
$ docker run -it -v $(pwd):/export frapsoft/openssl genrsa -aes256 -out /export/jwt.key
```

Leave the passphrase blank.

```
$ docker run -it -v $(pwd):/export frapsoft/openssl rsa -in /export/jwt.key -pubout -outform PEM -out /export/jwt.key.pub
```

You should then have the public / private key files in your local filesystem.
