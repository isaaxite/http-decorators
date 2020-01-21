import {IsNotEmpty, IsString, ValidateIf, IsInt, Min, IsIn, ValidationOptions, ValidationArguments, registerDecorator, validate} from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';

const TYPES = [0, 1, 2, 3];

// 自定义的validator
export function NotEqualDtoAtrr(compareProperty: string, validationOptions?: ValidationOptions) {
  return (object: {[key: string]: any}, propertyName: string) => {
    registerDecorator({
      name: 'NotEqualDtoAtrr',
      target: object.constructor,
      propertyName,
      constraints: [compareProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value !== args.object[compareProperty];
        },
      },
    });
  };
}

export class EditCategortDto {

  @IsInt({ message: '分类标签id必须是大于0的自然数' })
  @Min(1, { message: '分类标签id必须是大于0的自然数' })
  @IsNotEmpty({ message: '分类标签id不能为空' })
  id: number;

  @IsNotEmpty({ message: '新标签名不能为空' })
  @IsString({ message: '分类名必须是字符串' })
  name: string;

  @ValidateIf((req) => typeof req.parent !== 'undefined' || req.parent === 0)
  @NotEqualDtoAtrr('id', { message: '父分类标签不能与子分类标签id相同' })
  @IsInt({ message: '分类标签id必须是大于0的自然数' })
  @Min(1, { message: '分类标签id必须是大于0的自然数' })
  parent?: number | null;

  @ValidateIf((req) => typeof req.faqType !== 'undefined')
  @IsIn(TYPES, { message: '非法的Type' })
  @Transform((val) => Number(val))
  type?: string | number;
}

class Category {
  public edit(body: EditCategortDto) {
    console.log(body);
    return 'success';
  }
}

const cateIns = new Category();

// 校验参数
const params = {
  id: 1,
  parent: 1,
  name: '全部',
  type: 0,
};
const ins = plainToClass(EditCategortDto, params);
validate(ins).then((errors) => {
  // 调用方法
  if (errors && errors.length) {
    console.log(errors);
  } else {
    cateIns.edit(params);
  }
});
