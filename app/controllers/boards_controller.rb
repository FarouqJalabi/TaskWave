class BoardsController < ApplicationController

  before_action :set_board, only: [:show]
  before_action :authenticate_user!, only: [:create, :new]
  def index
    @boards = Board.all
  end
  def show
  end

  def new
    @board = Board.new
  end

  def create
      @board = current_user.boards.new(board_params)
      if @board.save
        redirect_to board_path(@board)
      elsif
      render :new, status: :unprocessable_entity
      end

  end

  private
  def set_board
    @board = Board.find(params[:id])
  end
  def board_params
    params.require(:board).permit(:name)
  end
end
