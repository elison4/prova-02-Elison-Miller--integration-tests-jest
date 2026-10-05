import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';

describe('Testes de integração - ReqRes API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://reqres.in';

  p.request.setDefaultTimeout(90000);

  beforeAll(() => {
    p.reporter.add(rep);
  });
// Teste 01, permite listar o usuarios
  it('01 - Deve listar os usuários', async () => {
    await p
      .spec()
      .get(`${baseUrl}/api/users?page=2`)
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object',
        properties: {
          page: { type: 'number' },
          per_page: { type: 'number' },
          total: { type: 'number' },
          total_pages: { type: 'number' },
          data: { type: 'array' }
        },
        required: [
          'page',
          'per_page',
          'total',
          'total_pages',
          'data'
        ]
      });
  });

  //Teste 02 permite buscar usuario por id
  it('02 - Deve buscar o usuário de ID 2', async () => {
    await p
      .spec()
      .get(`${baseUrl}/api/users/2`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        data: {
          id: 2
        }
      });
  });

  // Teste 03 permite dar erro ao buscar um usuario inesistente
  it('03 - Deve retornar 404 ao buscar usuário inexistente', async () => {
    await p
      .spec()
      .get(`${baseUrl}/api/users/23`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  //Teste 04 deve Cadastrar um novo Usuario
  it('04 - Deve cadastrar um novo usuário', async () => {
    await p
      .spec()
      .post(`${baseUrl}/api/users`)
      .withJson({
        name: 'Elison Miller',
        job: 'QA Tester'
      })
      .expectStatus(StatusCodes.CREATED)
      .expectJsonLike({
        name: 'Elison Miller',
        job: 'QA Tester'
      })
      .expectJsonSchema({
        type: 'object',
        properties: {
          name: { type: 'string' },
          job: { type: 'string' },
          id: { type: 'string' },
          createdAt: { type: 'string' }
        },
        required: ['name', 'job', 'id', 'createdAt']
      });
  });

  //Teste 05 permite atualizar os dados do usuario
  it('05 - Deve atualizar os dados de um usuário', async () => {
    await p
      .spec()
      .put(`${baseUrl}/api/users/2`)
      .withJson({
        name: 'Elison Miller',
        job: 'QA Tester Atualizado'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        name: 'Elison Miller',
        job: 'QA Tester Atualizado'
      });
  });

  afterAll(() => {
    p.reporter.end();
  });
});