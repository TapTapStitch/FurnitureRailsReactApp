class Employee < ApplicationRecord
  has_many :orders

  validates :full_name, presence: true
  validates :position, presence: true
end
