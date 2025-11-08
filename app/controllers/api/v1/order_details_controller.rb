module Api
  module V1
    class OrderDetailsController < BaseController
      # Спочатку знаходимо батьківський ресурс - Замовлення
      before_action :set_order
      # Потім знаходимо саму деталь
      before_action :set_order_detail, only: [ :show, :update, :destroy ]

      # GET /api/v1/orders/:order_id/order_details
      def index
        render json: @order.order_details.includes(:product)
      end

      # GET /api/v1/orders/:order_id/order_details/:id
      def show
        render json: @order_detail
      end

      # POST /api/v1/orders/:order_id/order_details
      def create
        @order_detail = @order.order_details.new(order_detail_params)

        if @order_detail.save
          # Тут варто було б оновити total_amount замовлення
          render json: @order_detail, status: :created
        else
          render json: @order_detail.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/orders/:order_id/order_details/:id
      def update
        if @order_detail.update(order_detail_params)
          # Тут також варто оновити total_amount
          render json: @order_detail
        else
          render json: @order_detail.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/orders/:order_id/order_details/:id
      def destroy
        @order_detail.destroy
        # І тут оновити total_amount
        head :no_content
      end

      private

      def set_order
        @order = Order.find(params[:order_id])
      end

      def set_order_detail
        @order_detail = @order.order_details.find(params[:id])
      end

      def order_detail_params
        params.require(:order_detail).permit(:product_id, :quantity, :unit_price)
      end
    end
  end
end
