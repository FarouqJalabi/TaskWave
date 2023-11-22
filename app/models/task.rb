class Task < ApplicationRecord
  belongs_to :list
  def due_color
    if due_date < 3.day.from_now
      'urgent'
    elsif due_date < 7.day.from_now
      'approaching'
      else
        'comfortable'
    end
  end
end
