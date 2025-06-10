import {
  BrandDTO,
  ColorwayDTO,
  CreateProductDTO,
  FetchedProductDTO,
  ListProductDTO,
  ModelDTO,
} from "../dtos/ProductDTO";
import {
  BrandModel,
  ColorwayModel,
  CreateProductModel,
  ModelModel,
  ProductListModel,
  ProductModel,
} from "../models/productModel";

export function fromListProductDTO(dto: ListProductDTO): ProductListModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    images: dto.images.map((image) => image.src),
    category: dto.category,
    condition: dto.condition,
    size: dto.size,
    price: dto.price,
    minPrice: dto.min_price,
    discountedPrice: dto.discounted_price,
    saves: dto.saves,
    saved: dto.saved,
    likes: dto.likes,
    liked: dto.liked,
    badges: dto.badges,
    itemsCount: dto.items_count,
    ownProduct: dto.own_product,
  };
}

export function fromFetchedProductDTO(dto: FetchedProductDTO): ProductModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    images: dto.images.map((image) => image.src),

    product: {
      id: dto.product.id,
      brand: dto.product.brand,
      model: dto.product.model,
      colorWay: dto.product.color_way,
      category: dto.product.category,
      colors: dto.product.colors, // Comma separated colors
    },

    items: dto.items.map((item) => ({
      id: item.id,
      condition: item.condition,
      price: item.price,
      size: item.size,
      state: item.state,
      gender: item.gender,
      onSale: item.on_sale,
    })),

    user: {
      id: dto.user.id,
      username: dto.user.username,
      first_name: dto.user.first_name,
      last_name: dto.user.last_name,
      phone_number: dto.user.phone_number,
      bio: dto.user.bio,
      profile_picture: dto.user.profile_picture,
      profile_background_color: dto.user.profile_background_color,
      profile_picture_color_palette: dto.user.profile_picture_color_palette,
    },

    saves: dto.saves,
    saved: dto.saved,
    likes: dto.likes,
    liked: dto.liked,
    badges: dto.badges,
    ownProduct: dto.own_product,
  };
}

export function fromBrandDTO(dto: BrandDTO): BrandModel {
  return {
    brand: dto.brand,
  };
}

export function fromModelDTO(dto: ModelDTO): ModelModel {
  return {
    model: dto.model,
  };
}

export function fromColorwayDTO(dto: ColorwayDTO): ColorwayModel {
  return {
    id: dto.id,
    colorWay: dto.color_way,
  };
}

export function toCreateProductDTO(
  model: CreateProductModel
): CreateProductDTO {
  return {
    title: model.title,
    description: model.description,

    product: {
      is_catalog: model.product.isCatalog,
      id: model.product.isCatalog ? model.product.id : null,
      brand: model.product.brand,
      model: model.product.model,
      color_way: model.product.colorWay,
      category: 2,
      colors: "#fff",
    },

    items: model.items.map((item) => ({
      condition: item.condition?.value!,
      gender: item.gender?.value!,
      size: item.size?.value!,
      price: item.price!,
      state: 1,
    })),

    county: 1, // TODO: Replace with actual county ID

    images: model.images.map((image) => ({
      file: image.file,
    })),
  };
}
