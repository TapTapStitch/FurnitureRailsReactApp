Rails.application.routes.draw do
  root 'homepage#index'
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :categories, only: [ :index, :show, :create, :update, :destroy ] do
        resources :products, only: [ :index ], controller: "categories/products"
      end

      resources :products, only: [ :index, :show, :create, :update, :destroy ]

      resources :customers, only: [ :index, :show, :create, :update, :destroy ] do
        resources :orders, only: [ :index ], controller: "customers/orders"
      end

      resources :employees, only: [ :index, :show, :create, :update, :destroy ]

      resources :orders, only: [ :index, :show, :create, :update, :destroy ] do
        resources :order_details, only: [ :index, :create, :update, :destroy ]
      end
    end
  end
end
