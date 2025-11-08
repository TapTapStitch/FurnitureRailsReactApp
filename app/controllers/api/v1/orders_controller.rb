module Api
  module V1
    class OrdersController < BaseController
      before_action :set_order, only: [ :show, :update, :destroy ]

      # GET /api/v1/orders
      def index
        @orders = Order.includes(:customer, :employee, :products).all
        render json: @orders.to_json(include: [ :customer, :products ])
      end

      # GET /api/v1/orders/:id
      def show
        render json: @order.to_json(include: [ :customer, :employee, order_details: { include: :product } ])
      end

      # POST /api/v1/orders
      def create
        @order = Order.new(order_params)

        if @order.save
          render json: @order.to_json(include: :order_details), status: :created
        else
          render json: @order.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/orders/:id
      def update
        if @order.update(order_params)
          render json: @order.to_json(include: :order_details)
        else
          render json: @order.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/orders/:id
      def destroy
        @order.destroy
        head :no_content
      end

      private

      def set_order
        @order = Order.find(params[:id])
      end

      def order_params
        params.require(:order).permit(
          :customer_id,
          :employee_id,
          :order_date,
          :status,
          :total_amount,
          # Дозволяємо вкладені атрибути для деталей замовлення
          order_details_attributes: [
            :product_id,
            :quantity,
            :unit_price
          ]
        )
      end
    end
  end
end
