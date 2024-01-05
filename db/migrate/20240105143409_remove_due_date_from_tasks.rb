class RemoveDueDateFromTasks < ActiveRecord::Migration[7.1]
  def change
    remove_column :tasks, :due_date, :date
  end
end
