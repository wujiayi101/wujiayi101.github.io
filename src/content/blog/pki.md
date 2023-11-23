---
title: "Certificates and PKI"
description: ""
pubDate: "Nov 25, 2023"
tags: ["pik", "ssl"]
---

## Understanding Public Key and Private Key

A <ins>public key</ins> is made available to the public and is used for encryption and verifying digital signatures. It is derived from a corresponding private key using complex mathematical algorithms. Public keys are widely distributed and can be freely shared.

a <ins>private key</ins> is kept secret and known only to the owner. It is used for decrypting messages encrypted with the corresponding public key and for generating digital signatures.

The use of public and private keys can be summarized as follows:

- **Encryption**: When someone wants to send an encrypted message to a recipient, they use the recipient's public key to encrypt the message. Only the corresponding private key possessed by the recipient can decrypt and read the message.

- **Digital Signatures**: To ensure the authenticity and integrity of digital data, a sender can generate a digital signature using their private key. The signature is attached to the data and can be verified by anyone who has access to the sender's public key. If the signature is valid, it provides evidence that the data has not been tampered with and originates from the claimed sender.

- **Authentication**: Public and private keys are also used for authentication purposes. When a user wants to prove their identity, they can digitally sign a challenge message using their private key. The recipient can verify the signature using the sender's public key, confirming that the sender indeed possesses the corresponding private key and is who they claim to be.

Overall, the use of public and private keys in PKI ensures confidentiality, integrity, authenticity, and non-repudiation in digital communications and transactions.

## Certificates and Chain of Trust

A certificate is a data structure that binds a <ins>public key</ins> with the <ins>name of an entity</ins>. It is signed by a Certificate Authority (CA) to validate its authenticity. 

Certificates play a crucial role in establishing trust and verifying the identities of entities in PKI. A CA vouches for the binding between a public key and a name by signing the certificate. The CA itself is another certificate with a corresponding private key used to sign other certificates.

A root CA is typically self-signed and kept offline for security purposes. It is recommended to store the root private keys offline, preferably on specialized hardware connected to an air-gapped machine.

To establish a chain of trust, the root CA certificate needs to be distributed to trusted stores. The CA accepts and processes Certificate Signing Requests (CSRs) and issues certificates to subscribers. The root private key is used infrequently to sign subordinate certificates for subordinate CAs, which automation and scalability in certificate issuance from subordinate CAs.

## Certificate Validation and the Chain of Trust

To validate an end entity certificate (also known as a leaf certificate), the public key from the issuer's certificate (typically a subordinate CA) is extracted and used to verify the signature on the leaf certificate. Similarly, the legitimacy of a subordinate CA certificate is verified by extracting the public key from a higher-ranked CA certificate. This process is repeated until the root certificate is reached.

![cert chain](/cert-chain.png)

Take the above certificate chain as example, the validation process can be summarized as followed:

---
| Cert Type | Entity | Issuer | Public key to verify cert | 
|-------------|-----------|----------------------------------|---|
| End Entity  | wu101.com| R3 | Public key in Subordinate CA cert |
| Subordinate CA | R3  | ISRG Root X1 | Public key in Root CA cert |
| Root CA | ISRG Root X1  | ISRG Root X1 | N/A, trusted by default |
---

Root CA certificates are typically <ins>self-signed</ins> and already trusted by machines and browsers. Machines and browsers are preconfigured with a list of trusted root certificates, also known as trust anchors, stored in a trust store.

Examples of some trusted store
- [Root certificates trusted by Chrome to authenticate HTTPS sites](https://chromium.googlesource.com/chromium/src/+/main/net/data/ssl/chrome_root_store/root_store.md). 
- [List of available trusted root certificates in iOS 12, macOS 10.14, watchOS 5, and tvOS 12](https://support.apple.com/kb/HT209144)
- [List of available trusted root certificates in macOS High Sierra](https://support.apple.com/kb/HT208127)
- [List of available trusted root certificates in macOS Sierra](https://support.apple.com/kb/HT207189)

## Process to Create a Certificate

The process to create a certificate involves the following steps:

1. Generate a key pair, consisting of a public key and a private key. It is essential to keep the private key secure and avoid sending it across the network.
2. Create a Certificate Signing Request (CSR) using the private key. The CSR includes information about the entity requesting the certificate.
3. Send the CSR to a CA for verification. The CA verifies the CSR's signature and assesses its authenticity.
4. If the CSR is valid, the CA issues a certificate to the requester, signing it with the CA's private key.

# References

- [Smallstep - Everything you should know about certificates and PKI](https://smallstep.com/blog/everything-pki/)
