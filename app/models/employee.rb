class Employee < ApplicationRecord
  has_many :orders, dependent: :destroy

  validates :full_name, presence: true
  validates :position, presence: true
end
