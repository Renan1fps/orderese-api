import { HttpException, HttpStatus } from '@nestjs/common';
import { SlugController } from './slug.controller';
import { CheckSlugAvailabilityUseCase } from '../../application/use-cases/check-slug-availability.use-case';

const makeUseCase = (available: boolean): CheckSlugAvailabilityUseCase => ({
  checkAvailability: jest.fn().mockResolvedValue({ available }),
} as unknown as CheckSlugAvailabilityUseCase);

describe('SlugController', () => {
  describe('checkAvailability', () => {
    it('should return { available: true } for a free slug', async () => {
      const controller = new SlugController(makeUseCase(true));
      const result = await controller.checkAvailability('free-slug');
      expect(result).toEqual({ available: true });
    });

    it('should throw 400 with available:false when slug is taken', async () => {
      const controller = new SlugController(makeUseCase(false));
      await expect(controller.checkAvailability('taken-slug')).rejects.toThrow(
        new HttpException({ available: false, message: 'Slug já está em uso' }, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw 422 when slug is empty', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 when slug has uppercase letters', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('Invalid-Slug')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 when slug has spaces', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('invalid slug')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 for SQL injection attempt', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability("' OR 1=1 --")).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 for XSS attempt', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('<script>alert(1)</script>')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 when slug starts with a hyphen', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('-bad-slug')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 when slug ends with a hyphen', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('bad-slug-')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });

    it('should throw 422 when slug has consecutive hyphens', async () => {
      const controller = new SlugController(makeUseCase(true));
      await expect(controller.checkAvailability('bad--slug')).rejects.toThrow(
        new HttpException({ message: 'O slug informado é inválido' }, HttpStatus.UNPROCESSABLE_ENTITY),
      );
    });
  });
});
