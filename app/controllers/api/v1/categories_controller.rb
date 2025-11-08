module Api
  module V1
    class CategoriesController < BaseController
      # Встановлюємо @category для :show, :update, :destroy
      before_action :set_category, only: [ :show, :update, :destroy ]

      # GET /api/v1/categories
      def index
        @categories = Category.all
        render json: @categories
      end

      # GET /api/v1/categories/:id
      def show
        render json: @category
      end

      # POST /api/v1/categories
      def create
        @category = Category.new(category_params)

        if @category.save
          render json: @category, status: :created # 201 Created
        else
          render json: @category.errors, status: :unprocessable_entity # 422
        end
      end

      # PATCH/PUT /api/v1/categories/:id
      def update
        if @category.update(category_params)
          render json: @category
        else
          render json: @category.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/categories/:id
      def destroy
        @category.destroy
        head :no_content # 204 No Content
      end

      private

      # Знаходимо категорію за :id
      def set_category
        @category = Category.find(params[:id])
      end

      # Strong Parameters: дозволяємо лише потрібні поля
      def category_params
        params.require(:category).permit(:name)
      end
    end
  end
end
