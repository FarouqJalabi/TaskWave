class BoardsController < ApplicationController

  before_action :set_board, only: [:show]
  def index
    @boards = Board.all
  end
  def show
  end

  private
  def set_board
    @board = Board.find(params[:id])
  end
end
