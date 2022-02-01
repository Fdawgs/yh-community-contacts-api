# Changelog

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
