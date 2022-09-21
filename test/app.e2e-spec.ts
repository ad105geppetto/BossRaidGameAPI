import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe("App E2E Test", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/user 유저 테스트", () => {
    it('(POST) 유저 생성 요청을 성공하면, 상태코드 201을 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/user')
        .expect(201)
    });

    it('(GET) 특정 유저 조회에 성공하면, 상태코드 200을 반환합니다.', () => {
      return request(app.getHttpServer())
        .get('/user/1')
        .expect(200)
    });

    it('(GET) 잘못된 id 파라미터를 작성하여 요청시, 상태코드 404과 메세지를 반환합니다.', () => {
      return request(app.getHttpServer())
        .get('/user/test999')
        .expect(404)
        .expect({
          "statusCode": 404,
          "message": "유저정보를 찾을 수 없습니다.",
          "error": "Not Found"
        })
    });
  })

  describe("/bossRaid 보스레이드 테스트", () => {
    it('(GET) 유저가 보스레이드에 참여할 수 있는지 입장 여부를 반환합니다.', () => {
      return request(app.getHttpServer())
        .get('/bossRaid')
        .expect(200)
    });


    it('(POST)/enter 보스레이드 입장 성공시, 상태코드 201을 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/enter')
        .send({
          "userId": 1,
          "level": 1
        })
        .expect(201)
    });

    it('(PATCH)/end 보스레이드 퇴장 성공시, 상태코드 200을 반환합니다.', () => {
      return request(app.getHttpServer())
        .patch('/bossRaid/end')
        .send({
          "userId": 1,
          "raidRecordId": 1
        })
        .expect(200)
    });

    it('(POST)/enter 잘못된 userId 요청시, 상태코드 404와 메세지를 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/enter')
        .send({ "userId": "9999", "level": "1" })
        .expect(404)
        .expect({
          "statusCode": 404,
          "message": "유저정보를 찾을 수 없습니다",
          "error": "Not Found"
        })
    });

    it('(POST)/enter 잘못된 level 요청시, 상태코드 404와 메세지를 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/enter')
        .send({ "userId": 1, "level": "2" })
        .expect(404)
        .expect({
          "statusCode": 404,
          "message": "보스레이드 레벨을 찾을 수 없습니다",
          "error": "Not Found"
        })
    });

    it('(POST)/end 존재하지 않는 userId 요청시, 상태코드 404와 메세지를 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/end')
        .send({
          "userId": 999999,
          "raidRecordId": 1
        })
        .expect(404)
    });

    it('(POST)/end 존재하지 않는 raidRecordId 요청시, 상태코드 404와 메세지를 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/end')
        .send({
          "userId": 1,
          "raidRecordId": 9999999999
        })
        .expect(404)
    });

    it('(POST)/topRankerList 보스레이드의 랭킹 리스트를 요청하면, 상태코드 200을 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/topRankerList')
        .send({ "userId": 1 })
        .expect(201)
    });

    it('(POST)/topRankerList 잘못된 userId 요청시, 상태코드 404와 메세지를 반환합니다.', () => {
      return request(app.getHttpServer())
        .post('/bossRaid/topRankerList')
        .send({ "userId": "9999" })
        .expect(404)
        .expect({
          "statusCode": 404,
          "message": "유저정보를 찾을 수 없습니다",
          "error": "Not Found"
        })
    });
  })

  afterAll(async () => {
    await app.close()
  })
})