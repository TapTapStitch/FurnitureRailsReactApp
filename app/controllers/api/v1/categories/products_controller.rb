module Api
  module V1
    module Categories
      # Цей контролер відповідає за /api/v1/categories/:category_id/products
      class ProductsController < BaseController
        before_action :set_category

        # GET /api/v1/categories/:category_id/products
        def index
          render json: @category.products
        end

        private

        def set_category
          @category = Category.find(params[:category_id])
        end
      end
    end
  end
end
