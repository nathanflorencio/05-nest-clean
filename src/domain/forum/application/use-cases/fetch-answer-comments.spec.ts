import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerCommentsRespository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRespository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRespository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRespository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRespository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRespository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRespository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
