class Customer < ApplicationRecord
  has_many :orders, dependent: :destroy

  validates :full_name, presence: true
  validates :phone, presence: true
  validates :email, uniqueness: true, allow_blank: true
end
