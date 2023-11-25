class Task < ApplicationRecord
  belongs_to :list
  def due_color
    if due_date == nil
      'hidden'
    elsif due_date < 3.day.from_now
      'bg-urgent text-white'
    elsif due_date < 7.day.from_now
      'bg-approaching'
      else
        'bg-comfortable'
    end
  end
end
