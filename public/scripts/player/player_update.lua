function update(entity, deltaTime)
  transform = get_transform(entity)
  material = get_material(entity)
  if transform then
    transform.rotation = { transform.rotation[1], transform.rotation[2] + 0.00157, transform.rotation[3] }
  end
  if material then
    local red =  (math.sin(get_time() / 100) + 1) / 2
    material.diffuse = { red, material.diffuse[2], material.diffuse[3] }
  end
end

return update