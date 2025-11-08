module Api
  module V1
    module Customers
      # Цей контролер відповідає за /api/v1/customers/:customer_id/orders
      class OrdersController < BaseController
        before_action :set_customer

        # GET /api/v1/customers/:customer_id/orders
        def index
          render json: @customer.orders.includes(:products)
        end

        private

        def set_customer
          @customer = Customer.find(params[:customer_id])
        end
      end
    end
  end
end
