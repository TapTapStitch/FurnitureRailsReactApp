class Order < ApplicationRecord
  belongs_to :customer
  belongs_to :employee
  has_many :order_details, dependent: :destroy
  has_many :products, through: :order_details

  accepts_nested_attributes_for :order_details

  validates :order_date, presence: true
  validates :status, presence: true
end
