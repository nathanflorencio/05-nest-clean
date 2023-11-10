import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRespository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRespository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRespository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRespository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentsRespository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentsRespository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRespository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
