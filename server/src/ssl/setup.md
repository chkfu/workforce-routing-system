## Building ssl certificates

<br/>

### Step 1:

Create RSA-encrypted keys:

```
$ openssl genrsa -out privatekey.pem 2048
```

2048 provides higher standard of key encryption but slightly longer time cost

<br/>

### Step 2:

Setup certificate requirement:

```
$ openssl req -new -key privatekey.pem -out csrreq.csr
```

<br/>

### Step 3:

Based on PKI protocol for CA certificate:

```
$ openssl x509 -req -days 365 -in csrreq.csr -signkey privatekey.pem -out ca.pem
```

Short expiry is a kind of security practice for protection, but the 365 days has been set for local development.

<br/>

### Step 4:

To secure the designated connection, you may install mkcert and then generate key and cert using:

```
$ mkcert -install
$ mkcert {designated_address}
```

With the example of `localhost`, please run:

```
$ mkcert localhost
```
