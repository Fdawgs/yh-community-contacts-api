# Changelog

## [2.0.0](https://github.com/Fdawgs/ydh-community-contacts-api/compare/v1.1.1...v2.0.0) (2022-03-08)


### ⚠ BREAKING CHANGES

* Minimum node engine bumped from `>=14.0.0` to `^14.17.0 || ^15.6.0 || >=16.0.0`
* `AUTH_BEARER_TOKEN_ARRAY` env variable removed
* `access.tokens` table added to migration SQL queries

### Features

* **routes/admin:** add access route ([#83](https://github.com/Fdawgs/ydh-community-contacts-api/issues/83)) ([f6caf95](https://github.com/Fdawgs/ydh-community-contacts-api/commit/f6caf952f82de47498b75ee613e5eec8eb41e74a))


### Bug Fixes

* **config:** redact request auth header from logs ([318f94f](https://github.com/Fdawgs/ydh-community-contacts-api/commit/318f94f849bc0069d22d210b8a1fe301ee7a68fe))


### Documentation

* **readme:** add usage section ([158f02e](https://github.com/Fdawgs/ydh-community-contacts-api/commit/158f02eed75bea30a340bacfab273ed5a280e81d))

### [1.1.1](https://github.com/Fdawgs/ydh-community-contacts-api/compare/v1.1.0...v1.1.1) (2022-03-08)


### Bug Fixes

* **plugins/shared-schemas:** use `examples` not `enum` for 404 responses ([2fc06e2](https://github.com/Fdawgs/ydh-community-contacts-api/commit/2fc06e27899ef973c1f0b4f52f471cf0b8d4c4fb))
* **routes/contact:** make `match.value` param case-insensitive ([1dd1a4c](https://github.com/Fdawgs/ydh-community-contacts-api/commit/1dd1a4cd2f334e3b35f170293dd959e8d8a74dde))
* **routes/contact:** use singular not plurals in read responses ([441a20c](https://github.com/Fdawgs/ydh-community-contacts-api/commit/441a20c703595513968d45e07e22bf17d9627df4))


### Continuous Integration

* only install chromium and firefox with playwright ([0ddb239](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0ddb239e31404fd5776812d0723b1d0f7c552b46))


### Improvements

* **public/images/icons:** compress apple-touch-icons ([#85](https://github.com/Fdawgs/ydh-community-contacts-api/issues/85)) ([b357954](https://github.com/Fdawgs/ydh-community-contacts-api/commit/b357954b9f77f4adc57ef97ce863b72a5b65116e))
* **routes/docs:** move html and redoc out of root context ([ac6bfb8](https://github.com/Fdawgs/ydh-community-contacts-api/commit/ac6bfb8c7c705b21d8210dbb0bf878ca5404f430))
* **routes:** add `preValidation` hooks directly into routes ([1dd4a94](https://github.com/Fdawgs/ydh-community-contacts-api/commit/1dd4a9495ad6249b004fe3555d3e39349e68901e))
* **server:** move db and db util functions to root context ([1d4d784](https://github.com/Fdawgs/ydh-community-contacts-api/commit/1d4d78418d5cdd49cb33cce0a695b9978b7ebc5c))


### Miscellaneous

* **.env.template:** double-quote example strings ([#86](https://github.com/Fdawgs/ydh-community-contacts-api/issues/86)) ([cd48d62](https://github.com/Fdawgs/ydh-community-contacts-api/commit/cd48d6267defbd24f133eb22e8ef3fcfa10ebfdc))
* **routes/contact/schema:** use plural in search summary ([911b3da](https://github.com/Fdawgs/ydh-community-contacts-api/commit/911b3da1b6cac5d4018393b8c9507e585b0d1332))


### Dependencies

* **deps-dev:** bump eslint-config-prettier from 8.4.0 to 8.5.0 ([fd88774](https://github.com/Fdawgs/ydh-community-contacts-api/commit/fd887747842811e1693ce94d72f2561e9f050b61))
* **deps-dev:** bump eslint-plugin-jsdoc from 37.9.4 to 37.9.5 ([d0da88a](https://github.com/Fdawgs/ydh-community-contacts-api/commit/d0da88a82adea2c30c932429023452f0a1716b9d))
* **deps-dev:** bump eslint-plugin-jsdoc from 37.9.5 to 37.9.7 ([20e8a9c](https://github.com/Fdawgs/ydh-community-contacts-api/commit/20e8a9cf14f98a3d4d21dd4a53aa99109cbb95f5))
* **deps:** bump actions/checkout from 2 to 3 ([4881ba8](https://github.com/Fdawgs/ydh-community-contacts-api/commit/4881ba8332df39cfa87aafa2c2008eed0d37154b))
* **deps:** bump fastify from 3.27.2 to 3.27.3 ([ca5e5dc](https://github.com/Fdawgs/ydh-community-contacts-api/commit/ca5e5dcedcb3b87006c15846ae096773c414b0f5))
* **deps:** bump fluent-json-schema from 3.0.1 to 3.1.0 ([1d2e80e](https://github.com/Fdawgs/ydh-community-contacts-api/commit/1d2e80e666bd7eca071e957f1d5bd5ae104a0a38))
* **deps:** bump jstoxml from 2.2.9 to 3.1.0 ([af1e3b8](https://github.com/Fdawgs/ydh-community-contacts-api/commit/af1e3b88c520ab7902aa26650bd7871930027e30))
* **deps:** bump pino-pretty from 7.5.1 to 7.5.3 ([99685a7](https://github.com/Fdawgs/ydh-community-contacts-api/commit/99685a78018d418138ece3b983c53e5764b110f0))

## [1.1.0](https://github.com/Fdawgs/ydh-community-contacts-api/compare/v1.0.2...v1.1.0) (2022-02-28)


### Features

* **routes/contact:** support `application/xml` responses ([#45](https://github.com/Fdawgs/ydh-community-contacts-api/issues/45)) ([62c6380](https://github.com/Fdawgs/ydh-community-contacts-api/commit/62c6380348d6bef9a036b9617058e0120614d939))


### Bug Fixes

* **config:** renew rate-limit if user attempts req in limit time window ([#36](https://github.com/Fdawgs/ydh-community-contacts-api/issues/36)) ([70b2c35](https://github.com/Fdawgs/ydh-community-contacts-api/commit/70b2c3569aa3207d4edb57e82a60af44ab8360b6))
* **migrate:** catch errors thrown ([156373d](https://github.com/Fdawgs/ydh-community-contacts-api/commit/156373db21be882f9ef5c112aa8275ba3695c583))
* **public/docs:** add x-ua-compatible meta tag ([565b2c3](https://github.com/Fdawgs/ydh-community-contacts-api/commit/565b2c36e0097f7335e71acf8d4c8f81bee1e91c))
* **routes/contact:** return 201 code and new record id on post reqs ([#43](https://github.com/Fdawgs/ydh-community-contacts-api/issues/43)) ([03f9530](https://github.com/Fdawgs/ydh-community-contacts-api/commit/03f9530294b35d6831cce0376eb9ad9734c7efd5))


### Improvements

* **config:** call `Error` as constructor, not function ([a361657](https://github.com/Fdawgs/ydh-community-contacts-api/commit/a361657620ec6ca597e8f233d51bcc9e865cc1dd))
* **migrate:** allow for function to be exported ([820da78](https://github.com/Fdawgs/ydh-community-contacts-api/commit/820da78b67463096a4075291dc560c40beaf8a68))
* **public:** remove unused web app manifest and icons ([127b2ff](https://github.com/Fdawgs/ydh-community-contacts-api/commit/127b2ffb3667e54bd4a6fbf7ca5631b0fdd43b51))


### Miscellaneous

* **.gitignore:** ignore live insert file ([df43b36](https://github.com/Fdawgs/ydh-community-contacts-api/commit/df43b36b525787011095bd2bf23a1d0f60342192))
* **public/site.webmanifest:** reduce short_name to 12 chars ([6129b13](https://github.com/Fdawgs/ydh-community-contacts-api/commit/6129b13dd56128ce72b116be66a03e563cefea54))
* **public:** add more apple-touch-icon sizes ([d30783c](https://github.com/Fdawgs/ydh-community-contacts-api/commit/d30783c457023c5c843233eab89fdc7ad0302553))
* **public:** rename mask-icon ([5588b5a](https://github.com/Fdawgs/ydh-community-contacts-api/commit/5588b5a7c568e3a64eefd87b17db61d9e2c4b72b))
* remove trailing whitespace ([7470ea5](https://github.com/Fdawgs/ydh-community-contacts-api/commit/7470ea5c75c155e2b7f5fd3f6b62b7d83149d80e))
* **routes:** update cors inline comment ([#39](https://github.com/Fdawgs/ydh-community-contacts-api/issues/39)) ([1954454](https://github.com/Fdawgs/ydh-community-contacts-api/commit/19544544a8530b08334c2e4189cff4ffbed87521))


### Dependencies

* **dependabot:** major tags no longer need ignore support ([cc3e71d](https://github.com/Fdawgs/ydh-community-contacts-api/commit/cc3e71d44081368ba16f5acdc314e0d83b7c84e5))
* **deps-dev:** bump @commitlint/cli from 16.1.0 to 16.2.1 ([0937c05](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0937c05dd8b73af34c1c22185b6491a7bbd871c2))
* **deps-dev:** bump @commitlint/config-conventional ([87f6e22](https://github.com/Fdawgs/ydh-community-contacts-api/commit/87f6e22f04395afffe0ddffc1d4d529b1f7cd069))
* **deps-dev:** bump autocannon from 7.6.0 to 7.7.0 ([19347b3](https://github.com/Fdawgs/ydh-community-contacts-api/commit/19347b31fb5465abbb1407842a2c1cc1d39e0c8c))
* **deps-dev:** bump eslint from 8.8.0 to 8.9.0 ([6c07895](https://github.com/Fdawgs/ydh-community-contacts-api/commit/6c078951a8802c6869244045f76d0ca6caaaeb42))
* **deps-dev:** bump eslint from 8.9.0 to 8.10.0 ([a6a5ee7](https://github.com/Fdawgs/ydh-community-contacts-api/commit/a6a5ee7e56ca1e773b4a7a84864276f93ed58b4e))
* **deps-dev:** bump eslint-config-prettier from 8.3.0 to 8.4.0 ([4a5ce3e](https://github.com/Fdawgs/ydh-community-contacts-api/commit/4a5ce3e39cc545f94809353aa4d8500e0322d60c))
* **deps-dev:** bump eslint-plugin-jest from 26.0.0 to 26.1.1 ([8792c0b](https://github.com/Fdawgs/ydh-community-contacts-api/commit/8792c0bb61c66fccf7939e8be71dfeb5de9b4557))
* **deps-dev:** bump eslint-plugin-jsdoc from 37.7.0 to 37.9.4 ([529fc40](https://github.com/Fdawgs/ydh-community-contacts-api/commit/529fc400c2e0317c9377d52bb13eec035d523cfb))
* **deps-dev:** bump jest from 27.4.7 to 27.5.1 ([b838c57](https://github.com/Fdawgs/ydh-community-contacts-api/commit/b838c57f91457129ab9eb1b1ff8434edcd0c8e8c))
* **deps-dev:** bump playwright from 1.18.1 to 1.19.1 ([9682554](https://github.com/Fdawgs/ydh-community-contacts-api/commit/968255497d297233e4e55c2e3ddf644a07d88a55))
* **deps-dev:** bump playwright from 1.19.1 to 1.19.2 ([54a4adb](https://github.com/Fdawgs/ydh-community-contacts-api/commit/54a4adbefc57696a4fe2c9c3c28bac32b1a8596f))
* **deps:** bump actions/github-script from 5 to 6 ([156009b](https://github.com/Fdawgs/ydh-community-contacts-api/commit/156009b85823b13865d01218532d2a2a8c1d2a78))
* **deps:** bump actions/setup-node from 2 to 3 ([6299d6e](https://github.com/Fdawgs/ydh-community-contacts-api/commit/6299d6e564fe20876e6332d672af1fe6e8ddcd18))
* **deps:** bump dotenv from 15.0.0 to 16.0.0 ([93bf697](https://github.com/Fdawgs/ydh-community-contacts-api/commit/93bf6975265e4f8dac5efb039c4b887c0efd9348))
* **deps:** bump fastify from 3.27.0 to 3.27.2 ([0612a0f](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0612a0f7cf14986801d0ffa32aed30f346d6ae32))
* **deps:** bump fastify-autoload from 3.10.0 to 3.11.0 ([23a7b3a](https://github.com/Fdawgs/ydh-community-contacts-api/commit/23a7b3ac6e32faedc97244528432890396fdb2ba))
* **deps:** bump fastify-bearer-auth from 6.1.0 to 6.2.0 ([55e8597](https://github.com/Fdawgs/ydh-community-contacts-api/commit/55e8597b79d652e2ecfb375174718315d472c894))
* **deps:** bump fastify-cors from 6.0.2 to 6.0.3 ([696ebc2](https://github.com/Fdawgs/ydh-community-contacts-api/commit/696ebc29ecff548a7b23c8532990295a3ec13474))
* **deps:** bump fastify-disablecache from 2.0.5 to 2.0.6 ([ae5bbd3](https://github.com/Fdawgs/ydh-community-contacts-api/commit/ae5bbd3262a9bf56bb1e536fe7d3d717eca4531b))
* **deps:** bump fastify-floc-off from 1.0.4 to 1.0.5 ([430cbe4](https://github.com/Fdawgs/ydh-community-contacts-api/commit/430cbe4657b2628011d9fb02e926360dc32f29ea))
* **deps:** bump fastify-rate-limit from 5.7.0 to 5.7.2 ([407dbcf](https://github.com/Fdawgs/ydh-community-contacts-api/commit/407dbcfbb00d5d34ec0aa0ecbb99c1024ded3441))
* **deps:** bump fastify-swagger from 4.12.0 to 4.15.0 ([d425abc](https://github.com/Fdawgs/ydh-community-contacts-api/commit/d425abc7b7af1dee9dea8411f2ab800e15803655))
* **deps:** bump follow-redirects from 1.14.7 to 1.14.8 ([172a220](https://github.com/Fdawgs/ydh-community-contacts-api/commit/172a22027759719fee03ee1695f15cacc7c780b2))
* **deps:** bump mssql from 8.0.1 to 8.0.2 ([0a9f8b9](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0a9f8b9a11e794ef286be8f7b5bfc3c74f02075f))
* **deps:** bump pg from 8.7.1 to 8.7.3 ([39571aa](https://github.com/Fdawgs/ydh-community-contacts-api/commit/39571aa2963b733e5ad0fd8b1ffa965544179123))
* **deps:** bump pino from 7.6.5 to 7.8.0 ([d181c32](https://github.com/Fdawgs/ydh-community-contacts-api/commit/d181c323e27b5f9849cc3dfad7cba31f8396d27e))
* **deps:** bump postgrator from 5.0.0 to 5.0.1 ([d6ab7d0](https://github.com/Fdawgs/ydh-community-contacts-api/commit/d6ab7d0e9256b5e38448807702098c88343a058c))
* **deps:** bump prismjs from 1.26.0 to 1.27.0 ([9f99aea](https://github.com/Fdawgs/ydh-community-contacts-api/commit/9f99aea44197823569099ad1e5042475a1519c36))
* **deps:** bump redoc from 2.0.0-rc.63 to 2.0.0-rc.64 ([3d645de](https://github.com/Fdawgs/ydh-community-contacts-api/commit/3d645de8e82ed909f47c731e71a4e8fc17abe6bf))
* **deps:** bump simple-get from 3.1.0 to 3.1.1 ([345aae3](https://github.com/Fdawgs/ydh-community-contacts-api/commit/345aae350623bf14734a5c0a62ced070b63da438))
* **deps:** bump sub-dependencies ([#78](https://github.com/Fdawgs/ydh-community-contacts-api/issues/78)) ([fd995f2](https://github.com/Fdawgs/ydh-community-contacts-api/commit/fd995f2b08e7d40db526a5d739565d51c5b700ab))

### [1.0.2](https://github.com/Fdawgs/ydh-community-contacts-api/compare/v1.0.1...v1.0.2) (2022-02-01)


### Bug Fixes

* **routes/contact:** ignore additional properties in pagination object ([#25](https://github.com/Fdawgs/ydh-community-contacts-api/issues/25)) ([55ad339](https://github.com/Fdawgs/ydh-community-contacts-api/commit/55ad33928a0d903c114cf15685ca22d86f4a6c7f))
* **utils/escape-single-quotes:** ignore non-string expressions ([#27](https://github.com/Fdawgs/ydh-community-contacts-api/issues/27)) ([2379a86](https://github.com/Fdawgs/ydh-community-contacts-api/commit/2379a86dcadc4e2c3fc64b422665be29b2e49958))


### Continuous Integration

* install playwright ([0ed046b](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0ed046b3f1c2199982b04d9b67f7b8073f19034d))


### Dependencies

* **deps-dev:** add playwright ([81c4aa9](https://github.com/Fdawgs/ydh-community-contacts-api/commit/81c4aa9c9180ea389a3cec2ca9cc0a53b90b78eb))
* **deps-dev:** bump eslint from 8.7.0 to 8.8.0 ([7b60adc](https://github.com/Fdawgs/ydh-community-contacts-api/commit/7b60adc631d9978d0ed65d29dc64afb9aa2e47c0))
* **deps:** bump dotenv from 14.3.2 to 15.0.0 ([e13a52a](https://github.com/Fdawgs/ydh-community-contacts-api/commit/e13a52a6dd885601df6d0d5b8afaed75935f6f8d))
* **deps:** bump fastify-helmet from 5.3.2 to 7.0.1 ([#12](https://github.com/Fdawgs/ydh-community-contacts-api/issues/12)) ([fc3320e](https://github.com/Fdawgs/ydh-community-contacts-api/commit/fc3320ee86ccaaad52b97858510c87b20d934028))
* **deps:** bump mssql from 7.3.0 to 8.0.1 ([91b2e73](https://github.com/Fdawgs/ydh-community-contacts-api/commit/91b2e73c638f20a398b8829aafbab326ddfaeec8))
* **deps:** bump pino from 7.6.4 to 7.6.5 ([0d5ced4](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0d5ced4283dbf6587e806f1baaff9ad2111297d4))
* **deps:** bump sub-dependencies ([#33](https://github.com/Fdawgs/ydh-community-contacts-api/issues/33)) ([2235ef4](https://github.com/Fdawgs/ydh-community-contacts-api/commit/2235ef495c97451e3a5c4fdffd97818c553845f4))

### [1.0.1](https://github.com/Fdawgs/ydh-community-contacts-api/compare/v1.0.0...v1.0.1) (2022-01-28)


### Bug Fixes

* **plugins/db:** log error if connection fails ([3d36949](https://github.com/Fdawgs/ydh-community-contacts-api/commit/3d369491d19d1a4eed8827d1715c6dd55cb575f4))
* **routes/contact:** escape single-quote characters ([74b83ed](https://github.com/Fdawgs/ydh-community-contacts-api/commit/74b83ed01c7e69696903081819af75470d0b7ec7))
* **routes/contact:** ignore additional properties in puts and posts objs ([#23](https://github.com/Fdawgs/ydh-community-contacts-api/issues/23)) ([68fa3b6](https://github.com/Fdawgs/ydh-community-contacts-api/commit/68fa3b699497064329a343b917a51439a1c9360b))
* **routes/contact:** remove duplicates caused by cross apply ([4c9155c](https://github.com/Fdawgs/ydh-community-contacts-api/commit/4c9155c45dbdc8d4ed097cbad8157e04f7e4fd03))
* **routes/contact:** restrict telecom values ([0bba7da](https://github.com/Fdawgs/ydh-community-contacts-api/commit/0bba7da923f7f5c71648714443c52e7d8b8d0d07))


### Documentation

* **readme:** add note regarding live records ([#24](https://github.com/Fdawgs/ydh-community-contacts-api/issues/24)) ([3196399](https://github.com/Fdawgs/ydh-community-contacts-api/commit/3196399323a390ae62b5a4780eef0dcc16c29a9d))
* **readme:** reduce verbosity of note ([82f387a](https://github.com/Fdawgs/ydh-community-contacts-api/commit/82f387ab08d6296b3790646d818ef1eab79094cb))


### Dependencies

* **dependabot:** ignore minor and patch commit-lint updates ([#15](https://github.com/Fdawgs/ydh-community-contacts-api/issues/15)) ([4f2527e](https://github.com/Fdawgs/ydh-community-contacts-api/commit/4f2527e7b2cc1d617ecd4f502fc81c1ed69f8461))
* **dependabot:** use default open-pull-requests-limit value ([f91e198](https://github.com/Fdawgs/ydh-community-contacts-api/commit/f91e19885667694192b5455a423130ee3e28e177))
* **deps-dev:** bump eslint-plugin-jsdoc from 37.6.3 to 37.7.0 ([2f315d9](https://github.com/Fdawgs/ydh-community-contacts-api/commit/2f315d982b1845850079cccc2b43f00179d0d38e))
* **deps:** bump dotenv from 14.2.0 to 14.3.2 ([344a390](https://github.com/Fdawgs/ydh-community-contacts-api/commit/344a390269841c19d7d7e45c431d4954617151e5))
* **deps:** bump fastify-plugin from 3.0.0 to 3.0.1 ([2426cf1](https://github.com/Fdawgs/ydh-community-contacts-api/commit/2426cf10828236a356ec6c3c0d017d0383ea31d9))
* **deps:** bump pino-pretty from 7.5.0 to 7.5.1 ([e5ff8fb](https://github.com/Fdawgs/ydh-community-contacts-api/commit/e5ff8fbb2a9448e0ff3211acf8841327eef408e7))
* **deps:** bump redoc from 2.0.0-rc.59 to 2.0.0-rc.61 ([7424132](https://github.com/Fdawgs/ydh-community-contacts-api/commit/742413231f1d550829626e715d373fd4f6a62a8f))
* **deps:** bump redoc from 2.0.0-rc.61 to 2.0.0-rc.63 ([#21](https://github.com/Fdawgs/ydh-community-contacts-api/issues/21)) ([349544f](https://github.com/Fdawgs/ydh-community-contacts-api/commit/349544f263374435e6516f610bed69df31d8c566))

## 1.0.0 (2022-01-24)


### Miscellaneous

* add api code ([#2](https://github.com/Fdawgs/ydh-community-contacts-api/issues/2)) ([4523326](https://github.com/Fdawgs/ydh-community-contacts-api/commit/4523326eeb73180cf2f4accf573ef2fc22674998))
* add development files ([42d3118](https://github.com/Fdawgs/ydh-community-contacts-api/commit/42d31180aa8c914e6ed2e9df38411fd37c41255d))
* add supporting files ([9b2cb78](https://github.com/Fdawgs/ydh-community-contacts-api/commit/9b2cb78ebaf46b5f859d5d5d0bb51a2cfe7f1aa5))


### Dependencies

* **deps-dev:** bump dev dependencies ([55c8123](https://github.com/Fdawgs/ydh-community-contacts-api/commit/55c81236b77e3bf15f59529e08dd0be1e00f872f))
* **deps:** bump dotenv from 10.0.0 to 14.2.0 ([8508d17](https://github.com/Fdawgs/ydh-community-contacts-api/commit/8508d17e40b2e90859d9a579873e825134894754))
* **deps:** bump env-schema from 3.5.1 to 3.5.2 ([c65c7f0](https://github.com/Fdawgs/ydh-community-contacts-api/commit/c65c7f04f377b3b3cf39d9fdb499ca4ce3589395))
* **deps:** bump fastify from 3.25.3 to 3.27.0 ([7d2accf](https://github.com/Fdawgs/ydh-community-contacts-api/commit/7d2accf3d20c6cd9e43977b894f309d874ba8039))
* **deps:** bump file-stream-rotator from 0.5.7 to 0.6.1 ([12e2d73](https://github.com/Fdawgs/ydh-community-contacts-api/commit/12e2d7362ea96d3e99c7979cf2229b25648786c6))
* **deps:** bump pino from 7.6.3 to 7.6.4 ([75bac7f](https://github.com/Fdawgs/ydh-community-contacts-api/commit/75bac7f9fd44f4801442ab91e3406eb1ef27449c))
* **deps:** bump pino-pretty from 7.3.0 to 7.5.0 ([a2b1e1c](https://github.com/Fdawgs/ydh-community-contacts-api/commit/a2b1e1c4e8b63d3b286b7e93a595205f2a234b8f))
* **deps:** bump sub-dependencies ([6237922](https://github.com/Fdawgs/ydh-community-contacts-api/commit/623792206c42140d0964656073fc8fa1b69faa89))


### Documentation

* **readme:** add case study and update acknowledgements section ([d65b0ca](https://github.com/Fdawgs/ydh-community-contacts-api/commit/d65b0caace0f2f68803dfbf54b48160cb634b369))
* **readme:** remove database setup; clarify purpose ([13ed6c1](https://github.com/Fdawgs/ydh-community-contacts-api/commit/13ed6c1723b3cac9b1ee5f9c89e9e902fff616f0))
