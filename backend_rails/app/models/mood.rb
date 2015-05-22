class Mood < ActiveRecord::Base
  validates :level, presence: true
  validates :level, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 2}
end
