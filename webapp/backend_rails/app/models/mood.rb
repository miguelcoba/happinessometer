class Mood < ActiveRecord::Base
  validates :level, presence: true
  validates :level, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 2}

  def as_json(options)
    data = { level: self.level, created_at: self.created_at.iso8601 }
    data[:comment] = self.comment if self.comment.present?
    data
  end
end
